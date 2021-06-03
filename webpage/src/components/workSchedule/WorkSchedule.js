import React, { Component } from 'react';

import moment from 'moment';
import 'moment/locale/pl';
import Scheduler, { SchedulerData, ViewTypes } from 'react-big-scheduler';
import withDragDropContext from './withDnDContext';
import NotificationModal from '../modals/NotificationModal';
import Modal from '../modals/Modal';
import UserContext from '../../contexts/User';
import '../../styles/WorkSchedule.css';
import 'react-big-scheduler/lib/css/style.css';

import * as api from '../../api';

import Loader from '../Loader';

class WorkSchedule extends Component {    
    constructor(props) {
        super(props);

        moment.locale('pl');
    
        let date = new Date();
        let day = (date.getDay() - 1).toString().padStart('0', 2);;
        let month = (date.getMonth() + 1).toString().padStart('0', 2);
        let year = date.getFullYear();

        let schedulerData = new SchedulerData(`${year}-${month}-${day}`, ViewTypes.Day, false, false, {
                views: [
                    { viewName: 'Tydzień', viewType: ViewTypes.Week, showAgenda: false, isEventPerspective: false },
                    { viewName: 'Dzień', viewType: ViewTypes.Day, showAgenda: false, isEventPerspective: false }
                ],
                resourceName: '',
                dayCellWidth: 100,
                eventItemHeight: 54,
                eventItemLineHeight: 58,
                schedulerWidth: '1164',
                dayResourceTableWidth: 200,
                weekResourceTableWidth: 200,
                nonAgendaDayCellHeaderFormat: 'HH:mm',
                nonAgendaOtherCellHeaderFormat: 'ddd DD.MM',
                // groupOnlySlotColor: '#E3E3E3',
                defaultEventBgColor: '#D9B430',
                selectedAreaColor: 'rgba(217, 180, 48, 0.5)'
                // minuteStep: 30,
            },
            {
                getDateLabelFunc: this.getDateLabel,
                isNonWorkingTimeFunc: this.isNonWorkingTime
            }, moment);

        schedulerData.localeMoment.locale('pl');

        let resources = [
            {
                id: 'owner',
                name: 'Jan Kowalski'
             //    groupOnly: true
             },
             {
                id: 'drivers',
                name: 'Kierowcy',
                groupOnly: true
             },
             {
                id: 'driver-1',
                name: 'Tomasz Rajdowiec',
                parentId: 'drivers'
             },
             {
                id: 'office',
                name: 'Sekretariat',
                groupOnly: true
             },
             {
                id: 'office-1',
                name: 'Anna Miła',
                parentId: 'office'
             }
        ];

        let events = [
            {
                id: 1,
                start: `${year}-${month}-${day} 09:30:00`,
                end:  `${year}-${month}-${day} 10:30:00`,
                resourceId: 'driver-1',
                title: 'Kraków - Katowice Parking nr 1 Merceder Benz 2019'
            }, 
            {
                id: 2,
                start: `${year}-${month}-${day} 10:30:00`,
                end:  `${year}-${month}-${day} 11:30:00`,
                resourceId: 'office-1',
                title: 'Roboty biurowe'
            }, 
            {
               id: 3,
               start: `${year}-${month}-${day} 14:30:00`,
               end: `${year}-${month}-${day} 15:30:00`,
               resourceId: 'office-1',
               title: 'Raporty'
            }, 
            {
                id: 4,
                start: `${year}-${month}-${day - 1} 14:30:00`,
                end: `${year}-${month}-${day - 1} 15:30:00`,
                resourceId: 'driver-1',
                title: 'Jazda'
            }, 
            {
               id: 5,
               start: `${year}-${month}-${day - 1} 15:30:00`,
               end:  `${year}-${month}-${day - 1} 17:30:00`,
               resourceId: 'driver-1',
               title: 'Brak'
           }
        ];

        schedulerData.setResources(resources);
        schedulerData.setEvents(events);

        this.state = {
            viewModel: schedulerData,
            modalDeleteEventVisibility: false,
            eventToDelete: null,
            events,
            resources,
            modalAddEventVisibility: false,
            newEvent: null,
            newEventTitle: '',
            modalEditVisibility: false,
            editEventTitle: '',
            eventToEdit: null
        }
    }

    render() {
        return (
            <div className="work-schedule page">
                <div className="main">
                    <div className="tile scheduler">
                        <h2>Grafik pracy</h2>
                        <div className="wrapper">
                            <Scheduler schedulerData={this.state.viewModel}
                                prevClick={this.prevClick}
                                nextClick={this.nextClick}
                                onSelectDate={this.onSelectDate}
                                onViewChange={this.onViewChange}
                                viewEventText="Edytuj"
                                viewEvent2Text="Usuń"
                                viewEventClick={this.editEvent}
                                viewEvent2Click={this.deleteEvent}
                                updateEventStart={this.updateEventStart}
                                updateEventEnd={this.updateEventEnd}
                                moveEvent={this.moveEvent}
                                newEvent={this.newEvent}
                                toggleExpandFunc={this.toggleExpandFunc}
                            />
                        </div>
                    </div>
                </div>
                <NotificationModal 
                    visible={this.state.modalDeleteEventVisibility}
                    header={'Usunięcie zdarzenia'}
                    name={'usunąć zdażenie'}
                    buttonText={'usuń'}
                    notificationModalExit={this.exitNotificationModalVisibility}
                    delete={this.confirmDeletingEvent}
                />
                <Modal visible={this.state.modalAddEventVisibility}>
                    <header>Dodawanie nowego zadania</header>
                    <section className="content">
                        <form className="new-event" onSubmit={(ev) => {ev.preventDefault(); this.confirmAddingEvent();}}>
                            <input placeholder="Dane zadania" value={this.state.newEventTitle} onChange={this.handleChangeNewTitle}/>
                        </form>
                    </section>
                    <section className="footer">
                        <button onClick={this.exitModalAddVisibility}>Anuluj</button>
                        <button onClick={this.confirmAddingEvent}>Zapisz</button>
                    </section>  
                </Modal>
                <Modal visible={this.state.modalEditVisibility}>
                    <header>Edytowanie zadania</header>
                    <section className="content">
                        <form className="edit-event" onSubmit={(ev) => {ev.preventDefault()}}>
                            <input placeholder="Dane zadania" value={this.state.editEventTitle} onChange={this.handelChangeEditTitle}/>
                        </form>
                    </section>
                    <section className="footer">
                        <button onClick={this.exitModalEditVisibility}>Anuluj</button>
                        <button onClick={this.confirmEditingEvent}>Zapisz</button>
                    </section>  
                </Modal>
            </div>
        )
    }

    getDateLabel = (schedulerData, viewType, startDate, endDate) => {
        let start = schedulerData.localeMoment(startDate);
        let end = schedulerData.localeMoment(endDate);
        let dateLabel = start.format('DD.MM.YYYY');

        if(viewType === ViewTypes.Week) {
            dateLabel = `${start.format('DD.MM')}-${end.format('DD.MM.YYYY')}`;
            if(start.month() !== end.month())
                dateLabel = `${start.format('DD.MM')}-${end.format('DD.MM.YYYY')}`;
            if(start.year() !== end.year())
                dateLabel = `${start.format('DD.MM.YYYY')}-${end.format('DD.MM.YYYY')}`;
        }

        return dateLabel;
    }

    prevClick = (schedulerData)=> {
        schedulerData.prev();
        schedulerData.setEvents(this.state.events);
        this.setState({
            viewModel: schedulerData
        });
    }

    nextClick = (schedulerData)=> {
        schedulerData.next();
        schedulerData.setEvents(this.state.events);
        this.setState({
            viewModel: schedulerData
        });
    }

    onViewChange = (schedulerData, view) => {
        schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
        schedulerData.setEvents(this.state.events);
        this.setState({
            viewModel: schedulerData
        });
    }

    onSelectDate = (schedulerData, date) => {
        schedulerData.setDate(date);
        schedulerData.setEvents(this.state.events);
        this.setState({
            viewModel: schedulerData
        });
    }

    editEvent = (schedulerData, event) => {       
        if(this.context.user.role === 'owner') {
            this.setState({
                modalEditVisibility: true,
                eventToEdit: event,
            });
        }
        else if(this.context.user.role === 'office' && event.resourceId.startsWith('driver-')) {
            this.setState({
                modalEditVisibility: true,
                eventToEdit: event,
            });
        }
    };

    handelChangeEditTitle = (ev) => {
        this.setState({
            editEventTitle: ev.target.value
        });
    }

    confirmEditingEvent = () => {
        if(this.state.editEventTitle === '') {
            alert('Wprowadź nazwę zadania');
            return;
        }

        let scheduler = [ ...this.state.events ];
        let targetEvent = scheduler.find(event => event.id === this.state.eventToEdit.id);
        let targetIndex = scheduler.indexOf(targetEvent);

        scheduler[targetIndex].title = this.state.editEventTitle;

        this.state.viewModel.setEvents(scheduler);
        this.setState({
            events: scheduler,
            modalEditVisibility: false,
            editEventTitle: ''
        });
    }

    exitModalEditVisibility =() => {
        this.setState({
            modalEditVisibility: false,
            editEventTitle: ''
        });
    }

    setNotificationModalVisibility = () => {
        this.setState({ 
            modalDeleteEventVisibility: true
        });
    }

    exitNotificationModalVisibility = () => {
        this.setState({ 
            modalDeleteEventVisibility: false
        });
    }

    confirmDeletingEvent = () => {
        this.state.viewModel.removeEvent(this.state.eventToDelete);
      
        this.setState({
            modalDeleteEventVisibility: false
        });
    }

    deleteEvent = (schedulerData, event) => {
        this.setState({ 
            modalDeleteEventVisibility: true,
            eventToDelete: event
        });
    }

    exitModalAddVisibility = () => {
        this.setState({ 
            modalAddEventVisibility: false,
            newEventTitle: ''
        });
    }

    handleChangeNewTitle = (ev) => {
        this.setState({
            newEventTitle: ev.target.value
        });
    }

    confirmAddingEvent = () => {
        if(this.state.newEventTitle === '') {
            alert('Wprowadź nazwę zadania');
            return;
        }

        let event = { ...this.state.newEvent, title: this.state.newEventTitle };
        this.state.viewModel.addEvent(event);
        
        this.setState({
            modalAddEventVisibility: false,
            newEventTitle: ''
        });
    }

    newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
        if(this.context.user.role === 'owner') {
            let newFreshId = 0;
            schedulerData.events.forEach((item) => {
                if(item.id >= newFreshId)
                    newFreshId = item.id + 1;
            });
            
            this.setState({
                modalAddEventVisibility: true,
                newEvent: {
                    id: newFreshId,
                    start: start,
                    end: end,
                    resourceId: slotId
                }
            }); 
        }
        else if(this.context.user.role === 'office' && slotId.startsWith('driver-')) {
            let newFreshId = 0;
            schedulerData.events.forEach((item) => {
                if(item.id >= newFreshId)
                    newFreshId = item.id + 1;
            });
            
            this.setState({
                modalAddEventVisibility: true,
                newEvent: {
                    id: newFreshId,
                    start: start,
                    end: end,
                    resourceId: slotId
                }
            }); 
        }
        else return;
    }

    updateEventStart = (schedulerData, event, newStart) => {
        let startTimeBeforeMove =  event.start;
        schedulerData.updateEventStart(event, newStart);

        if(this.context.user.role === 'owner') {
            this.setState({
                viewModel: schedulerData
            });
        }
        else if(this.context.user.role === 'office' && event.resourceId.startsWith('driver-')) {
            this.setState({
                viewModel: schedulerData
            });
        }
        else {
            schedulerData.updateEventStart(event, startTimeBeforeMove);
            this.setState({
                viewModel: schedulerData
            });
        }
    }

    updateEventEnd = (schedulerData, event, newEnd) => {
        let endTimeBeforeMove =  event.end;
        schedulerData.updateEventEnd(event, newEnd);

        if(this.context.user.role === 'owner') {
            this.setState({
                viewModel: schedulerData
            });
        }
        else if(this.context.user.role === 'office' && event.resourceId.startsWith('driver-')) {
            this.setState({
                viewModel: schedulerData
            });
        }
        else {
            schedulerData.updateEventEnd(event, endTimeBeforeMove);
            this.setState({
                viewModel: schedulerData
            });
        }
    }

    moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
        let groupBeforeMove = event.resourceId;
        schedulerData.moveEvent(event, slotId, slotName, start, end);
        let gruopAfterMove = event.resourceId;

        if(this.context.user.role === 'owner') {
            this.setState({
                viewModel: schedulerData
            });
        }
        else if(this.context.user.role === 'office' && slotId.startsWith('driver-')
        && (groupBeforeMove.startsWith('driver-') && gruopAfterMove.startsWith('driver-'))) {
            this.setState({
                viewModel: schedulerData
            });
        }
    }

    toggleExpandFunc = (schedulerData, slotId) => {
        schedulerData.toggleExpandStatus(slotId);
        this.setState({
            viewModel: schedulerData
        });
    }

    isNonWorkingTime = (schedulerData, time) => {    
        return false;
    }
}

WorkSchedule.contextType = UserContext;

export default withDragDropContext(WorkSchedule);