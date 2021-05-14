import React, { useEffect, useState } from 'react';
import '../../styles/Timetable.css';

import Dropdown from '../dropdowns/Dropdown';
import TimetableFilterDays from './TimetableFilterDays';
import TimetableItem from './TimetableItem';
import { ModalLoader } from '../Loader';
import Modal from '../modals/Modal';
import { fromValue } from '../../helpers/from-value';
import toast from '../../helpers/toast';

import * as api from '../../api';


function Timetable() {
    let [loading, setLoading] = useState(true);
    let loadingInitTime = Date.now();

    let [timetable, setTimetable] = useState([]); 
    let [user, setUser] = useState({});

    let [availableTypes] = useState([
        [false, 'niedyspozycja'],
        [true, 'dostępność']
    ]);

    let [selectedAvailableType, setSelectedAvailableType] = useState();

    let [dates, setDates] = useState(
        new Array(7)
        .fill(null)
        .map((date, i) => new Date(new Date().getTime() + i * 24 * 3600 * 1000))
    );

    let [selectedDate, setSelectedDate] = useState();

    let [modalAddAvailabilityVisibility, setModalAddAvailabilityVisibility] = useState(false);
    let [modalEditAvailabilityVisibility, setModalEditAvailabilityVisibility] = useState(false);
    let [modalDeleteVisibility, setModalDeleteVisibility] = useState(false);

    let [days, setDays] = useState(''); 
    let [ranges, setRanges] = useState(''); 
    let [label, setLabel] = useState('');

    let [currentEditAvailabilityId, setCurrentEditAvailabityId] = useState(-1);
    let [currentUserId, setCurrentUserId] = useState(-1);

    let [selectedAvailableTypeEdit, setSelectedAvailableTypeEdit] = useState();
    let [selectedDateEdit, setSelectedDateEdit] = useState();
    let [daysEdit, setDaysEdit] = useState(''); 
    let [rangesEdit, setRangesEdit] = useState([]); 
    let [labelEdit, setLabelEdit] = useState('');
    let [availableIndex, setAvailableIndex] = useState(-1);
    let [dateIndex, setDateIndex] = useState('');

    let [selectedItem, setSelectedItem] = useState(-1);

    let [itemToDelete, setItemToDelete] = useState(-1);

    useEffect(() => {
        api.getTimetable()
            .then((results) => {
                setTimetable(results);
                setTimeout(() => {
                    setLoading(false);
                }, Math.max(0, 250 - (Date.now() - loadingInitTime)));
            })    
            .catch(api.toastifyError);

        api.getUserInfo()
            .then((result) => {
                setUser(result);
            })
            .catch(api.toastifyError);
    }, []);

    let d = new Date(); //data pozyskana z filtru
    let filterDays = [];
    let availableTileWidth = 115;
    let availableTileMargin = 15;
    let formatterFilterDays = [];

    function setFilterDays() {
        for(let i = 0; i < 7; i++) {
            let weekDay = (['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'])[(d.getDay() + i) % 7];   
            let monthDay = (d.getDate() + i).toString().padStart(2, '0');
            let month = (d.getMonth() + 1).toString().padStart(2, '0');
            let displayText = `${weekDay}, ${monthDay}.${month}`; 

            filterDays[i] = displayText;
            formatterFilterDays[i] = filterDays[i].slice(4).split('-').reverse().join('.');
        }

        return filterDays;
    }

   function compareDate(filterResult) {
    let weekAvailable = [null, null, null, null, null, null, null]; 
    
    filterResult.items.forEach((item) => {
        let comparer = item.startDate.slice(5).split('-').reverse().join('.');
        let days = item.days;
        let range = item.ranges;
        let available = item.available;
        let label = item.label;
        let id = item.id;

        filterDays.forEach((filterDay, i) => {
            if(filterDay.includes(comparer)) {
                weekAvailable[i] = {
                    range, 
                    width: availableTileWidth * days + availableTileMargin * (days - 1),
                    available,
                    label,
                    id
                };

                if(days > 1) {
                    for(let j = 1; j < days; j++) {
                        weekAvailable[i + j] = 'occupied';
                    }
                }
            }
        });
    }); 
    return weekAvailable;
   }

   function addAvailability() {
        setModalAddAvailabilityVisibility(true);
   }

   function saveAvailability() {
        setModalAddAvailabilityVisibility(false);

        api.addTimetableItem(selectedDate.toJSON().slice(0, 10), parseInt(days), ranges.split(','), selectedAvailableType[0], label)
            .then(refreshTimeTable)
            .catch(api.toastifyError);
   }

   function saveAvailabilityToUser() {
    setModalAddAvailabilityVisibility(false);
    api.addTimetableItemToUser(selectedItem.userId, selectedDate.toJSON().slice(0, 10), parseInt(days), ranges.split(','), selectedAvailableType[0], label)
        .then(refreshTimeTable)
        .catch(api.toastifyError);
   }

   function refreshTimeTable() {
        api.getTimetable()
            .then((results) => {
                setTimetable(results);
            })    
            .catch(api.toastifyError);
   }

   function translateRole(role) {
    return ({
            client: 'klient',
            driver: 'kierowca',
            office: 'pracownik sekretariatu',
            owner: 'właściciel'
        })[role];
    }

    function editAvailable(itemId, userId) {
        setModalEditAvailabilityVisibility(true);
        setCurrentEditAvailabityId(itemId);
        setCurrentUserId(userId);

        let user = timetable.find(v => v.userId === userId);
        let item = user.items.find(v => v.id === itemId);

        setLabelEdit(item.label);
        setDaysEdit(item.days);
        setRangesEdit(item.ranges.join(','));
        setAvailableIndex(item.available ? 1 : 0);
        
        let index = formatterFilterDays.indexOf(item.startDate.slice(5).split('-').reverse().join('.'));
        setDateIndex(index);
    }

    function saveEditAvailability() {
        setModalEditAvailabilityVisibility(false);

        if(typeof(parseInt(daysEdit)) !== 'number') {
            toast.error('Nieprawidłowy typ danych!');
        }
        else {
            api.updateTimetableItem(
                currentEditAvailabilityId, 
                selectedDateEdit.toJSON().slice(0, 10), 
                parseInt(daysEdit), 
                rangesEdit.split(','), 
                selectedAvailableTypeEdit[0], 
                labelEdit
            )
                .then(refreshTimeTable)
                .catch(api.toastifyError);
        }
    }

    function deleteAvailability(itemId) {
        api.deleteTimetableItem(itemId)
            .then(refreshTimeTable)
            .catch(api.toastifyError);
    }


    return (
        <div className="timetable page">
            <ModalLoader loading={loading} />
            <div className="main">
                <div className="tile">
                    <h2>Filtry</h2>
                    <div className="filters">
                        <div className="filter-container">
                            <span>Profesja:</span>
                            <Dropdown placeholder="kierowca, sekretariat"/>
                        </div>
                        <div className="filter-container">
                            <span>Zakres:</span>
                            <Dropdown placeholder="3.04-9.04"/>
                        </div>
                    </div>
                </div>
               <TimetableFilterDays 
                    children={setFilterDays().map((filterDay, i) => {
                        return (
                            <span key={i}>{filterDay}</span>
                        )
                    })}
               />
               <div className="timetable-item-container">
                {timetable.map((filterResult) => {
                    return (
                            <TimetableItem key={filterResult.userId}
                                id={filterResult.userId}
                                addAvailability={addAvailability}
                                name={filterResult.name}
                                role={translateRole(filterResult.role)}
                                onSelected={() => setSelectedItem(filterResult)}
                                modalDeleteVisibility={modalDeleteVisibility}
                                setModalDeleteVisibility={() => setModalDeleteVisibility(false)}
                                deleteAvailability={() => deleteAvailability(itemToDelete)}
                                children={compareDate(filterResult).map((item, i) => {
                                    if(item !== null && item !== 'occupied') {
                                        return (
                                            <div className={item.available ? 'available' : 'unavailable'} key={i} style={{width: item.width + "px"}}>
                                                <span>{(item.label ? item.label : (item.available ? 'Dostępność' : 'Niedostępność'))}</span>
                                                    {item.range.map((range, j) => {
                                                        return (
                                                            <span key={j}>{range}</span>
                                                        );
                                                    })}
                                                    {
                                                        (filterResult.userId === user.id || user.role === 'owner')
                                                        ? <div className="menu">
                                                            <button className="menu-item edit" onClick={() => editAvailable(item.id, user.id)} title="Edytuj"></button>
                                                            <button className="menu-item delete" onClick={() => {
                                                                setModalDeleteVisibility(true);
                                                                setItemToDelete(item.id);
                                                            }} 
                                                                title="Usuń"></button>
                                                        </div>
                                                        : null   
                                                    }
                                            </div>                                            
                                        );
                                    }
                                    else if(item === null) {
                                        return (
                                            <span style={{width: availableTileWidth + 'px'}}></span>
                                        );
                                    }
                                })}
                            />
                    );
                })}
               </div>
            </div>
            <Modal visible={modalAddAvailabilityVisibility}>
                <header>Dodawanie dyspozycji</header>
                <section className="content">
                    <form className="add-availability">
                        <Dropdown
                                placeholder="Typ"
                                alwaysSelected
                                items={availableTypes}
                                textProperty="1"
                                handleChange={setSelectedAvailableType}
                        />
                        <input placeholder="Etykieta (opcjonalnie)" onChange={fromValue(setLabel)} />
                        <Dropdown 
                            placeholder="Data rozpoczęcia"
                            alwaysSelected
                            items={dates}
                            textFormatter={(item) => item && item.toLocaleDateString()}
                            handleChange={setSelectedDate}
                        />
                        <input placeholder="Liczba dni" value={days} onChange={fromValue(setDays)} />
                        <input placeholder="Godziny" value={ranges} onChange={fromValue(setRanges)} />
                    </form>
                </section>
                <section className="footer">
                    <button onClick={() => setModalAddAvailabilityVisibility(false)}>Anuluj</button>
                    <button onClick={user.role !== 'owner' ? saveAvailability : saveAvailabilityToUser}>Zapisz</button>
                </section>  
            </Modal>
            <Modal visible={modalEditAvailabilityVisibility}>
                <header>Edycja dyspozycji</header>
                <section className="content">
                    <form className="add-availability">
                        <Dropdown
                            placeholder="Typ"
                            alwaysSelected
                            selectedIndex={availableIndex.toString()}
                            items={availableTypes}
                            textProperty="1"
                            handleChange={setSelectedAvailableTypeEdit}
                        />
                        <input placeholder="Etykieta (opcjonalnie)" defaultValue={labelEdit} onChange={fromValue(setLabelEdit)}/>
                        <Dropdown 
                            placeholder="Data rozpoczęcia"
                            alwaysSelected
                            selectedIndex={dateIndex}
                            items={dates}
                            textFormatter={(item) => item && item.toLocaleDateString()}
                            handleChange={setSelectedDateEdit}
                        />
                        <input placeholder="Liczba dni" defaultValue={daysEdit} onChange={fromValue(setDaysEdit)} />
                        <input placeholder="Godziny" defaultValue={rangesEdit} onChange={fromValue(setRangesEdit)}/>
                    </form>
                </section>
                <section className="footer">
                    <button onClick={() => setModalEditAvailabilityVisibility(false)}>Anuluj</button>
                    <button onClick={saveEditAvailability}>Zapisz</button>
                </section>  
            </Modal>
        </div>
    );
}

export default Timetable;
