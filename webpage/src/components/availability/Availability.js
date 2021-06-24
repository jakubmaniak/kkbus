import React, { Component } from 'react';

import moment from 'moment';
import 'moment/locale/pl';
import Scheduler, { SchedulerData, ViewTypes } from 'react-big-scheduler';
import withDragDropContext from '../workSchedule/withDnDContext';
import NotificationModal from '../modals/NotificationModal';
import Modal from '../modals/Modal';
import { ModalLoader } from '../Loader';
import Dropdown from '../dropdowns/Dropdown';
import UserContext from '../../contexts/User';
import '../../styles/WorkSchedule.css';
import 'react-big-scheduler/lib/css/style.css';

import * as api from '../../api';


class Availability extends Component {  
    
    constructor(props) {
        super(props);

        moment.locale('pl');
        let schedulerData = this.setupSchedulerData();
    
        let date = new Date();
        let day = (date.getDate()).toString().padStart(2, '0');
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let year = date.getFullYear();

       

        this.state = {
            loading: true,
            viewModel: schedulerData,
            modalDeleteEventVisibility: false,
            eventToDelete: null,
            events: [],
            modalAddEventVisibility: false,
            newEvent: null,
            newEventType: null,
            items: ['Zajętość', 'Dostępność'],
            modalEditVisibility: false,
            editEventType: '',
            colors: ['#C73535', '#47BE61']
        }
    }

    componentDidMount() {
        Promise.all([
            this.updateAvailabilityEntitiesResources()
        ])
        .then(() => this.updateAvailabilityEntitiesEvents())
        .then(() => {
            this.setState({ loading: false });
        });
    }

    setupSchedulerData() {
        let schedulerData = new SchedulerData(
            moment().format('YYYY-MM-DD'), 
            ViewTypes.Day, 
            false, 
            false, 
            {
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
                selectedAreaColor: 'rgba(217, 180, 48, 0.5)',
                minuteStep: 60,
            },
            {
                getDateLabelFunc: this.getDateLabel,
                isNonWorkingTimeFunc: this.isNonWorkingTime
            }, 
            moment
        );

        schedulerData.setResources([
            {
                id: 'drivers',
                name: 'Kierowcy',
                groupOnly: true
            },
            {
                id: 'office',
                name: 'Sekretariat',
                groupOnly: true
            }
        ]);

        schedulerData.localeMoment.locale('pl');

        return schedulerData;
    }
        
    updateAvailabilityEntitiesResources() {
        return api.getEmployeeNames().then((employees) => {
            let owners = employees.filter((employee) => employee.role === 'owner');
            let office = employees.filter((employee) => employee.role === 'office');
            let drivers = employees.filter((employee) => employee.role === 'driver');
            
            owners = owners.map((owner) => ({
                id: 'owner-' + owner.id,
                name: owner.firstName + ' ' + owner.lastName
            }));

            office = office.map((office) => ({
                id: 'office-' + office.id,
                name: office.firstName + ' ' + office.lastName,
                parentId: 'office'
            }));

            drivers = drivers.map((driver) => ({
                id: 'driver-' + driver.id,
                name: driver.firstName + ' ' + driver.lastName,
                parentId: 'drivers'
            }));

            let resources = [
                ...owners,
                {
                    id: 'office',
                    name: 'Sekretariat',
                    groupOnly: true
                },
                ...office,
                {
                    id: 'drivers',
                    name: 'Kierowcy',
                    groupOnly: true
                },
                ...drivers
            ];

            this.state.viewModel.setResources(resources);
        });
    }

    updateAvailabilityEntitiesEvents(startDate = null, endDate = null) {
        return api.getAvailabilityEntities(startDate, endDate).then((events) => {
            events = events.map((event) => ({
                id: event.id,
                start: event.date + ' ' + event.startHour + ':00',
                end: event.date + ' ' + event.endHour + ':00',
                resourceId: event.role + '-' + event.employeeId,
                title: event.available ? 'Dostępność' : 'Zajętość',
                bgColor: event.available ? this.state.colors[1] : this.state.colors[0]
            }));
            this.setState({ events });

            this.state.viewModel.setEvents(events);
        });
    }

    render() {
        return (
            <div className="work-schedule page">
                <div className="main">
                {this.state.loading ? <ModalLoader/> : null}
                    <div className="tile scheduler">
                        <h2>Dyspozycyjność</h2>
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
                    header={'Usuwanie statusu dyspozycyjności'}
                    name={'usunąć dyspozycyjności'}
                    buttonText={'usuń'}
                    notificationModalExit={this.exitNotificationModalVisibility}
                    delete={this.confirmDeletingEvent}
                />
                <Modal visible={this.state.modalAddEventVisibility}>
                    <header>Dodawanie statusu dyspozycyjności</header>
                    <section className="content">
                        <form className="new-event" onSubmit={(ev) => {ev.preventDefault(); this.confirmAddingEvent();}}>
                            <Dropdown 
                                items={this.state.items}
                                alwaysSelected
                                placeholder="Wybierz status dyspozycyjności"
                                handleChange={(item) => this.setState({ newEventType: item })}
                            />
                        </form>
                    </section>
                    <section className="footer">
                        <button onClick={this.exitModalAddVisibility}>Anuluj</button>
                        <button onClick={this.confirmAddingEvent}>Zapisz</button>
                    </section>  
                </Modal>
                <Modal visible={this.state.modalEditVisibility}>
                    <header>Edytowanie statusu dyspozycyjności</header>
                    <section className="content">
                        <form className="edit-event" onSubmit={(ev) => {ev.preventDefault()}}>
                        <Dropdown 
                                items={this.state.items}
                                alwaysSelected
                                placeholder="Wybierz status dyspozycyjności"
                                handleChange={(item) => this.setState({ editEventType: item })}
                        />
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
        this.setState({ loading: true });
        schedulerData.prev();

        let promise;
        if (schedulerData.viewType === ViewTypes.Week) {
            promise = this.updateAvailabilityEntitiesEvents(schedulerData.startDate, schedulerData.endDate);
        }
        else {
            promise = this.updateAvailabilityEntitiesEvents(schedulerData.startDate);
        }

        promise.then(() => this.setState({ loading: false }));
    }

    nextClick = (schedulerData)=> {
        this.setState({ loading: true });
        schedulerData.next();

        let promise;
        if (schedulerData.viewType === ViewTypes.Week) {
            promise = this.updateAvailabilityEntitiesEvents(schedulerData.startDate, schedulerData.endDate);
        }
        else {
            promise = this.updateAvailabilityEntitiesEvents(schedulerData.startDate);
        }

        promise.then(() => this.setState({ loading: false }));
    }

    onViewChange = (schedulerData, view) => {
        schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
        schedulerData.setEvents(this.state.events);
        
        let promise;
        if (view.viewType === ViewTypes.Week) {
            promise = this.updateAvailabilityEntitiesEvents(schedulerData.startDate, schedulerData.endDate);
        }
        else {
            promise = this.updateAvailabilityEntitiesEvents(schedulerData.startDate);
        }

        promise.then(() => this.setState({ loading: false }));
    }

    onSelectDate = (schedulerData, date) => {
        schedulerData.setDate(date);
        this.setState({ loading: true });

        let dateString = date.format('YYYY-MM-DD');
        this.updateAvailabilityEntitiesEvents(dateString)
            .then(() => this.setState({ loading: false }));
    }

    editEvent = (schedulerData, event) => {
        if(this.context.user.role + '-' + this.context.user.id === event.resourceId) {            
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
        let scheduler = [ ...this.state.events ];
        let targetEvent = scheduler.find(event => event.id === this.state.eventToEdit.id);
        let targetIndex = scheduler.indexOf(targetEvent);

        api.updateAvailabilityEntity(this.state.eventToEdit.id, {
            available: this.state.editEventType === 'Dostępność'
        });

        scheduler[targetIndex].title = this.state.editEventType;
        scheduler[targetIndex].bgColor = this.state.editEventType === 'Dostępność' ? this.state.colors[1] : this.state.colors[0];

        this.state.viewModel.setEvents(scheduler);
        this.setState({
            events: scheduler,
            modalEditVisibility: false,
            eventToEdit: null
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
      
        api.deleteAvailabilityEntity(this.state.eventToDelete.id);

        this.setState({
            modalDeleteEventVisibility: false,
            eventToDelete: null
        });
    }

    deleteEvent = (schedulerData, event) => {
        if(this.context.user.role + '-' + this.context.user.id === event.resourceId) {
            this.setState({ 
                modalDeleteEventVisibility: true,
                eventToDelete: event
            });
        }
    }

    exitModalAddVisibility = () => {
        this.setState({ 
            modalAddEventVisibility: false,
            newEventTitle: ''
        });
    }

    confirmAddingEvent = () => {
        let employeeId = parseInt(this.state.newEvent.resourceId.split('-')[1], 10);
        let date = moment(this.state.newEvent.start).format('YYYY-MM-DD');
        let startHour = moment(this.state.newEvent.start).format('HH:mm');
        let endHour = moment(this.state.newEvent.end).format('HH:mm');
        let available = this.state.newEventType === 'Dostępność';
        api.addAvailabilityEntity(employeeId, date, startHour, endHour, available)
            .then((result) => {
            let event = { ...this.state.newEvent, id: result.id, title: this.state.newEventType, bgColor: this.state.newEventType === 'Dostępność' ?  '#47BE61' : '#C73535' };
            this.state.viewModel.addEvent(event);

            this.setState({
                modalAddEventVisibility: false,
                newEventType: ''
            });
        })
        .catch((err) => console.log(err));
    }

    newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
        if(this.context.user.role + '-' + this.context.user.id === slotId) {
            this.setState({
                modalAddEventVisibility: true,
                newEvent: {
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

        if(this.context.user.role + '-' + this.context.user.id === event.resourceId) {
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

        if(this.context.user.role + '-' + this.context.user.id === event.resourceId) {
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
        let startBefore = event.start;
        let endBefore = event.end;

        schedulerData.moveEvent(event, slotId, slotName, start, end);

        let gruopAfterMove = event.resourceId;

        if(groupBeforeMove === this.context.user.role + '-' + this.context.user.id && gruopAfterMove === this.context.user.role + '-' + this.context.user.id) {
            this.setState({
                viewModel: schedulerData
            });
        }
        else {
            schedulerData.moveEvent(event, groupBeforeMove, slotName, startBefore, endBefore);
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

Availability.contextType = UserContext;

export default withDragDropContext(Availability);