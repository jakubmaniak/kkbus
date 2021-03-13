import React from 'react';
import '../styles/WorkSchedule.css';

function WorkSchedule() {
    function selectItem() {
        let items = document.querySelectorAll('.hidden');
        items.forEach(item => {
            item.classList.remove('hidden');
            item.classList.add('shown');
        });
    }
    
    return (
        <div className="work-schedule-page">
            <div className="main">
                <div className="tile">
                    <h2>Filtry</h2>
                    <div className="row-container">
                        <div className="list-container">
                            <span>Kierowca:</span>
                            <div className="drop-down-list">
                                <div className="list-items-container">
                                    <div className="list-items">
                                        <div className="list-item">Tomasz Rajdowiec</div>
                                        <div className="list-item hidden">Tomasz Rajdowiec</div>
                                        <div className="list-item hidden">Tomasz Rajdowiec</div>
                                        <div className="list-item hidden">Tomasz Rajdowiec</div>
                                    </div>
                                </div>
                                <button className="list-button" onClick={selectItem}>v</button>
                            </div>
                        </div>
                        <div className="list-container">
                            <span>Trasy:</span>
                            <div className="drop-down-list">
                                <div className="list-items-container">
                                    <div className="list-items">
                                        <div className="list-item">wszystkie</div>
                                        <div className="list-item hidden">wszystkie</div>
                                        <div className="list-item hidden">wszystkie</div>
                                        <div className="list-item hidden">wszystkie</div>
                                    </div>
                                </div>
                                <button className="list-button" onClick={selectItem}>v</button>
                            </div>
                        </div>
                    </div>
                   <div className="row-container">
                        <div className="list-container">
                                <span>Zakres dni:</span>
                                <div className="drop-down-list">
                                    <div className="list-items-container">
                                        <div className="list-items">
                                            <div className="list-item">dzisiaj, jutro</div>
                                            <div className="list-item hidden">dzisiaj, jutro</div>
                                            <div className="list-item hidden">dzisiaj, jutro</div>
                                            <div className="list-item hidden">dzisiaj, jutro</div>
                                        </div>
                                    </div>
                                    <button className="list-button" onClick={selectItem}>v</button>
                                </div>
                            </div>
                            <div className="list-container">
                                <span>Kierunki:</span>
                                <div className="drop-down-list">
                                    <div className="list-items-container">
                                        <div className="list-items">
                                            <div className="list-item">wszystkie</div>
                                            <div className="list-item hidden">wszystkie</div>
                                            <div className="list-item hidden">wszystkie</div>
                                            <div className="list-item hidden">wszystkie</div>
                                        </div>
                                    </div>
                                    <button className="list-button" onClick={selectItem}>v</button>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    );
}

export default WorkSchedule;
