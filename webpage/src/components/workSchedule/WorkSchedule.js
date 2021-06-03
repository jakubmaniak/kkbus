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

        //dodać obsługę grafiku z uwzględnieniem roli użytkownika

        let schedulerData = new SchedulerData( `${year}-${month}-${day}`, ViewTypes.Day, false, false, {
                views: [
                    { viewName: 'Tydzień', viewType: ViewTypes.Week, showAgenda: false, isEventPerspective: false },
                    { viewName: 'Dzień', viewType: ViewTypes.Day, showAgenda: false, isEventPerspective: false }
                ],
                resourceName: '',
                dayCellWidth: 100,
                eventItemHeight: 54,
                eventItemLineHeight: 58,
                // eventItemHeight: 22,
                // eventItemLineHeight: 24,
                nonWorkingTimeHeadBgColor: '#FFF',
                nonWorkingTimeBodyBgColor: '#FFF',
                schedulerWidth: '1220',
                nonAgendaDayCellHeaderFormat: 'HH:mm',
                nonAgendaOtherCellHeaderFormat: 'ddd DD.MM',
                groupOnlySlotColor: '#E3E3E3',
                defaultEventBgColor: '#D9B430',
            // defaultEventBgColor: '##d9b430',
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
                name: 'Jan Kowalski',
             //    groupOnly: true
             },
             {
                id: 'drivers',
                name: 'Kierowcy',
                groupOnly: true,
                creatable: false
             },
             {
                id: 'driver-1',
                name: 'Tomasz Rajdowiec',
                parentId: 'drivers',
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
                start: '2021-05-31 09:30:00',
                end: '2021-05-31 11:30:00',
                resourceId: 'driver-1',
                title: 'Kraków - Katowice Parking nr 1 Merceder Benz 2019',
            }, 
            {
                id: 2,
                start: '2021-05-31 10:30:00',
                end: '2021-05-31 12:30:00',
                resourceId: 'office-1',
                title: 'Roboty biurowe',
                resizable: false,
            }, 
            {
               id: 3,
               start: '2021-05-31 14:30:00',
               end: '2021-05-31 17:30:00',
               resourceId: 'office-1',
               title: 'Raporty',
               moveale: false,
            }, 
            {
                id: 4,
                start: '2021-06-01 14:30:00',
                end: '2021-06-01 23:30:00',
                resourceId: 'driver-1',
                title: 'Jazda',
                startResizable: false,
            }, 
            {
               id: 5,
               start: '2021-06-01 14:30:00',
               end: '2021-06-01 23:30:00',
               resourceId: 'driver-1',
               title: 'Brak',
               startResizable: false,
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
            newEventTitle: ''
        }
    }

    render() {
        return (
            <div className="work-schedule page">
                <div className="main">
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
                            // updateEventStart={this.updateEventStart}
                            // updateEventEnd={this.updateEventEnd}
                            moveEvent={this.moveEvent}
                            newEvent={this.newEvent}
                        />
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
                            <input placeholder="Dane zadania" value={this.state.newEventTitle} onChange={this.handleChange}/>
                        </form>
                    </section>
                    <section className="footer">
                        <button onClick={this.exitModalVisibility}>Anuluj</button>
                        <button onClick={this.confirmAddingEvent}>Zapisz</button>
                    </section>  
                </Modal>
                <Modal visible={this.state.modalAddEventVisibility}>
                    <header>Dodawanie nowego zadania</header>
                    <section className="content">
                        <form className="new-event" onSubmit={(ev) => {ev.preventDefault(); this.confirmAddingEvent();}}>
                            <input placeholder="Dane zadania" value={this.state.newEventTitle} onChange={this.handleChange}/>
                        </form>
                    </section>
                    <section className="footer">
                        <button onClick={this.exitModalVisibility}>Anuluj</button>
                        <button onClick={this.confirmAddingEvent}>Zapisz</button>
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

    isNonWorkingTime = (schedulerData, time) => {
		const { localeMoment } = schedulerData;
        if(schedulerData.viewType === ViewTypes.Day){
            let hour = localeMoment(time).hour();
            if(hour < 9 || hour > 18)
                return true;
        }
        else {
            let dayOfWeek = localeMoment(time).weekday();
            if (dayOfWeek === 5 || dayOfWeek === 6)
                return true;
        }
    
        return false;
	};

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
        alert(`You just executed ops2 to event: {id: ${event.id}, title: ${event.title}}`);
    };

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

    exitModalVisibility = () => {
        this.setState({ 
            modalAddEventVisibility: false
        });
    }

    handleChange = (ev) => {
        this.setState({
            newEventTitle: ev.target.value
        });
    }

    confirmAddingEvent = () => {
        let event = { ...this.state.newEvent, title: this.state.newEventTitle };
        this.state.viewModel.addEvent(event);
       
        this.setState({
            modalAddEventVisibility: false,
            newEventTitle: ''
        });
    }

    newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
        console.log({schedulerData, slotId, slotName, start, end, type, item});

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
        schedulerData.updateEventStart(event, newStart);
        this.setState({
            viewModel: schedulerData
        });
    }

    updateEventEnd = (schedulerData, event, newEnd) => {
        schedulerData.updateEventEnd(event, newEnd);
        this.setState({
            viewModel: schedulerData
        });
    }

    moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
        schedulerData.moveEvent(event, slotId, slotName, start, end);
        this.setState({
            viewModel: schedulerData
        });
    }
}

WorkSchedule.contextType = UserContext;

export default withDragDropContext(WorkSchedule);