import React, { Component } from 'react';

import moment from 'moment';
import 'moment/locale/pl';
import Scheduler, { SchedulerData, ViewTypes } from 'react-big-scheduler';
import withDragDropContext from './withDnDContext';
import NotificationModal from '../modals/NotificationModal';
import Modal from '../modals/Modal';
import { ModalLoader } from '../Loader';
import UserContext from '../../contexts/User';
import Dropdown from '../dropdowns/Dropdown';
import '../../styles/WorkSchedule.css';
import 'react-big-scheduler/lib/css/style.css';
import { routeFormatter } from '../../helpers/text-formatters';

import * as api from '../../api';

class WorkSchedule extends Component {    
    constructor(props) {
        super(props);

        moment.locale('pl');

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
                defaultEventBgColor: '#D9B430',
                selectedAreaColor: 'rgba(217, 180, 48, 0.5)'
            },
            {
                getDateLabelFunc: this.getDateLabel,
                isNonWorkingTimeFunc: this.isNonWorkingTime
            },
            moment
        );
        schedulerData.localeMoment.locale('pl');

        this.schedulerData = schedulerData;

        let resources = [
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
        ];

        schedulerData.setResources(resources);

        this.state = {
            loading: true,
            viewModel: schedulerData,
            modalDeleteEventVisibility: false,
            eventToDelete: null,
            events: [],
            resources,
            modalAddEventVisibility: false,
            newEvent: null,
            newEventTitle: '',
            modalEditVisibility: false,
            editEventTitle: '',
            eventToEdit: null,
            routes: null,
            parkings: ['Parking nr 1', 'Parking nr 2'],
            vehicles: null,
            selectedVehicle: null
        };
    }

    componentDidMount() {
        this.getRoutes().then(() => {
            Promise.all([
                this.getVehicles(),
                this.updateScheduleResources(),
                this.updateScheduleEvents()
            ]).then(() => {
                this.setState({ loading: false });
            });
        })
    }

    updateScheduleResources() {
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

            this.setState({ resources });

            this.schedulerData.setResources(resources);
        });
    }

    updateScheduleEvents(startDate = null, endDate = null) {
        return api.getWorkSchedule(startDate, endDate).then((events) => {
            events = events.map((event) => ({
                id: event.id,
                start: event.date + ' ' + event.startHour + ':00',
                end: event.date + ' ' + event.endHour + ':00',
                resourceId: event.role + '-' + event.employeeId,
                title: event.role === 'driver' ? 
                this.state.routes.find(route => route.id == event.routeId) ?
                        routeFormatter(this.state.routes.find(route => route.id == event.routeId)) 
                        + '\n' +  event.parking 
                        + '\n' + (this.state.vehicles.find(vehicle => vehicle.id === event.vehicleId)).brand
                        + ' ' + (this.state.vehicles.find(vehicle => vehicle.id === event.vehicleId)).model
                        + ' ' + (this.state.vehicles.find(vehicle => vehicle.id === event.vehicleId)).year
                        : null
                    : event.label
            }));
            this.setState({ events });
            

            this.schedulerData.setEvents(events);
        });
    }

    getRoutes() {
        return api.getAllRoutes()
            .then((results) => {
                this.setState({ routes: results});
            })
            .catch(api.toastifyError);
    }

    getVehicles() {
        return api.getAllVehicles()
            .then((results) => {
                this.setState({ vehicles: results});
            })
            .catch(api.toastifyError);
    }

    render() {
        return (
            <div className="work-schedule page">
                <div className="main">
                    {this.state.loading ? <ModalLoader/> : null}
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
                        {this.state.newEvent?.resourceId.startsWith('driver-') ? 
                                <>
                                <Dropdown 
                                    items={this.state.routes}
                                    textFormatter={routeFormatter}
                                    selectedIndex={0}
                                    handleChange={(selectedRoute) => this.setState({ selectedRoute })}
                                />
                                 <Dropdown 
                                    items={this.state.vehicles}
                                    selectedIndex={0}
                                    textFormatter={({ brand, model, year }) => brand + ' ' + model + ' ' + year}
                                    handleChange={(selectedVehicle) => this.setState({ selectedVehicle })}
                                />
                                <Dropdown 
                                    items={this.state.parkings}
                                    selectedIndex={0}
                                    handleChange={(selectedParking) => this.setState({ selectedParking })}
                                />
                                </>        
                            : 
                                <input placeholder="Dane zadania" value={this.state.newEventTitle} onChange={this.handleChangeNewTitle}/>
                            }
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
                        {this.state.eventToEdit?.resourceId.startsWith('driver-') ? 
                                <>
                                <Dropdown 
                                    items={this.state.routes}
                                    textFormatter={routeFormatter}
                                    selectedIndex={this.getRouteIndexToEdit()}
                                    handleChange={(selectedRoute) => this.setState({ selectedRoute })}
                                />
                                 <Dropdown 
                                    items={this.state.vehicles}
                                    selectedIndex={this.getVehicleIndexToEdit()}
                                    textFormatter={({ brand, model, year }) => brand + ' ' + model + ' ' + year}
                                    handleChange={(selectedVehicle) => this.setState({ selectedVehicle })}
                                />
                                <Dropdown 
                                    items={this.state.parkings}
                                    selectedIndex={this.getParkingIndexToEdit()}
                                    handleChange={(selectedParking) => this.setState({ selectedParking })}
                                />
                                </>        
                            : 
                                <input placeholder="Dane zadania" value={this.state.editEventTitle} onChange={this.handelChangeEditTitle}/>
                            }
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

    getRouteIndexToEdit() {
        let findRoute = this.state.routes.find(route => this.state.eventToEdit?.title.startsWith(route.departureLocation + ' - ' + route.arrivalLocation));
        let index = this.state.routes.indexOf(findRoute);
        return index;
    }

    getVehicleIndexToEdit() {
        let findVehicle = this.state.vehicles.find(vehicle => this.state.eventToEdit?.title.includes(vehicle.brand + ' ' + vehicle.model + ' ' + vehicle.year));
        let index = this.state.vehicles.indexOf(findVehicle);
        return index;
    }

    getParkingIndexToEdit() {
        let findParking = this.state.parkings.find(parking => this.state.eventToEdit?.title.includes(parking));
        let index = this.state.parkings.indexOf(findParking);
        return index;
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

    prevClick = (schedulerData) => {
        this.setState({ loading: true });
        schedulerData.prev();

        let promise;
        if (schedulerData.viewType === ViewTypes.Week) {
            promise = this.updateScheduleEvents(schedulerData.startDate, schedulerData.endDate);
        }
        else {
            promise = this.updateScheduleEvents(schedulerData.startDate);
        }

        promise.then(() => this.setState({ loading: false }));
    }

    nextClick = (schedulerData) => {
        this.setState({ loading: true });
        schedulerData.next();

        let promise;
        if (schedulerData.viewType === ViewTypes.Week) {
            promise = this.updateScheduleEvents(schedulerData.startDate, schedulerData.endDate);
        }
        else {
            promise = this.updateScheduleEvents(schedulerData.startDate);
        }

        promise.then(() => this.setState({ loading: false }));
    }

    onViewChange = (schedulerData, view) => {
        schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
        schedulerData.setEvents(this.state.events);
        
        let promise;
        if (view.viewType === ViewTypes.Week) {
            promise = this.updateScheduleEvents(schedulerData.startDate, schedulerData.endDate);
        }
        else {
            promise = this.updateScheduleEvents(schedulerData.startDate);
        }

        promise.then(() => this.setState({ loading: false }));
    }

    onSelectDate = (schedulerData, date) => {
        schedulerData.setDate(date);
        this.setState({ loading: true });

        let dateString = date.format('YYYY-MM-DD');
        this.updateScheduleEvents(dateString)
            .then(() => this.setState({ loading: false }));
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
        if(this.state.editEventTitle === '' && this.state.eventToEdit.resourceId.startsWith('office-')) {
            alert('Wprowadź nazwę zadania');
            return;
        }

        let scheduler = [ ...this.state.events ];
        let targetEvent = scheduler.find(event => event.id === this.state.eventToEdit.id);
        let targetIndex = scheduler.indexOf(targetEvent);
        let label;

        if(this.state.eventToEdit.resourceId.startsWith('driver-')) {
            label = this.state.selectedRoute.departureLocation + ' - ' + this.state.selectedRoute.arrivalLocation + '\n' 
                + this.state.selectedParking + '\n' + this.state.selectedVehicle.brand + ' ' + this.state.selectedVehicle.model 
                + ' ' + this.state.selectedVehicle.year;
        }
        else {
            label = this.state.editEventTitle;
        }

        scheduler[targetIndex].title = label;

        this.state.viewModel.setEvents(scheduler);
        this.setState({
            events: scheduler,
            modalEditVisibility: false,
            editEventTitle: '',
            selectedParking: null,
            selectedRoute: null,
            selectedVehicle: null
        });
    }

    exitModalEditVisibility = () => {
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
      
        api.deleteWorkScheduleEvent(this.state.eventToDelete.id);

        this.setState({
            modalDeleteEventVisibility: false,
            eventToDelete: null
        });
    }

    deleteEvent = (schedulerData, event) => {
        console.log({...event});
        if (this.context.user.role === 'owner') {
            this.setState({ 
                modalDeleteEventVisibility: true,
                eventToDelete: event
            });
        }
        else if (this.context.user.role === 'office' && event.resourceId.startsWith('driver-')) {
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

    handleChangeNewTitle = (ev) => {
        this.setState({
            newEventTitle: ev.target.value
        });
    }

    confirmAddingEvent = () => {
        if(this.state.newEventTitle === '' && this.state.newEvent.resourceId.startsWith('office-')) {
            alert('Wprowadź nazwę zadania');
            return;
        }

        let employeeId = parseInt(this.state.newEvent.resourceId.split('-')[1], 10);
        let date = moment(this.state.newEvent.start).format('YYYY-MM-DD');
        let startHour = moment(this.state.newEvent.start).format('HH:mm');
        let endHour = moment(this.state.newEvent.end).format('HH:mm');
        let label;
        let routeId;
        let parking;
        let vehicleId;
        if(this.state.newEvent.resourceId.startsWith('driver-')) {
            label = this.state.selectedRoute.departureLocation + ' - ' + this.state.selectedRoute.arrivalLocation + '\n' 
                + this.state.selectedParking + '\n' + this.state.selectedVehicle.brand + ' ' + this.state.selectedVehicle.model 
                + ' ' + this.state.selectedVehicle.year;
            routeId = this.state.selectedRoute.id;
            parking = this.state.selectedParking;
            vehicleId = this.state.selectedVehicle.id;
        }
        else {
            label = this.state.newEventTitle;
        }

        if(this.state.newEvent.resourceId.startsWith('driver-')) {
            api.addWorkScheduleEvent(employeeId, date, startHour, endHour, '', vehicleId, routeId, parking)
            .then((result) => {
                let event = { ...this.state.newEvent, id: result.id, title: label };

                this.state.viewModel.addEvent(event);
                
                this.setState({
                    modalAddEventVisibility: false,
                    newEventTitle: '',
                    selectedParking: null,
                    selectedRoute: null,
                    selectedVehicle: null
                });
            });
        }

        else {
            api.addWorkScheduleEvent(employeeId, date, startHour, endHour, label, null, 0, null)
            .then((result) => {
                let event = { ...this.state.newEvent, id: result.id, title: label };

                this.state.viewModel.addEvent(event);
                
                this.setState({
                    modalAddEventVisibility: false,
                    newEventTitle: ''
                });
            });
        }
    }

    newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
        if(this.context.user.role === 'owner') {            
            this.setState({
                modalAddEventVisibility: true,
                newEvent: {
                    start: start,
                    end: end,
                    resourceId: slotId
                }
            }); 
        }
        else if(this.context.user.role === 'office' && slotId.startsWith('driver-')) {            
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
        let isOwner = (this.context.user.role === 'owner');
        let isOffice = (this.context.user.role === 'office');
        let isDriverEvent = (event.resourceId.startsWith('driver-'));
        let hasPermission = (isOwner || (isOffice && isDriverEvent));
        
        if (hasPermission) {
            schedulerData.updateEventStart(event, newStart);
            
            let startHour = moment(newStart).format('HH:mm');
            api.updateWorkScheduleEvent(event.id, { startHour });
        }

        this.setState({ viewModel: schedulerData });
    }

    updateEventEnd = (schedulerData, event, newEnd) => {
        let isOwner = (this.context.user.role === 'owner');
        let isOffice = (this.context.user.role === 'office');
        let isDriverEvent = (event.resourceId.startsWith('driver-'));
        let hasPermission = (isOwner || (isOffice && isDriverEvent));
        
        if (hasPermission) {
            schedulerData.updateEventEnd(event, newEnd);
            
            let endHour = moment(newEnd).format('HH:mm');
            api.updateWorkScheduleEvent(event.id, { endHour });
        }

        this.setState({ viewModel: schedulerData });
    }

    moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
        let isOwner = (this.context.user.role === 'owner');
        let isOffice = (this.context.user.role === 'office');
        let isDriverEvent = (event.resourceId.startsWith('driver-'));
        let hasPermission = (isOwner || (isOffice && isDriverEvent));

        let currentRole = event.resourceId.split('-')[0];
        let newRole = slotId.split('-')[0];

        if (!hasPermission || currentRole !== newRole) return;

        let employeeId = parseInt(slotId.split('-')[1], 10);
        let startHour = moment(start).format('HH:mm');
        let endHour = moment(end).format('HH:mm');
        api.updateWorkScheduleEvent(event.id, { employeeId, startHour, endHour });

        schedulerData.moveEvent(event, slotId, slotName, start, end);
        this.setState({ viewModel: schedulerData });
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