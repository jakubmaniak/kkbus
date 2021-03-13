import React from 'react';
import '../styles/WorkSchedule.css';

function WorkScheduleFilter(props) {
    function selectItem(ev) {
        let listContainer = ev.currentTarget.parentNode;
        let items = listContainer.querySelectorAll('.hidden');

        items.forEach(item => {
            item.classList.remove('hidden');
            item.classList.add('shown');
        });
    }

    return (
        <div className="list-container">
            <span>{props.label}</span>
            <div className="drop-down-list" onClick={(ev) => selectItem(ev)}>
                <div className="list-items-container">
                    <div className="list-items">
                        {props.children}
                        {/* <div className="list-item">Tomasz Rajdowiec</div>
                        <div className="list-item hidden">Tomasz Rajdowiec</div>
                        <div className="list-item hidden">Tomasz Rajdowiec</div>
                        <div className="list-item hidden">Tomasz Rajdowiec</div> */}
                    </div>
                </div>
                <button className="list-button">&gt;</button>
            </div>
        </div>
    );
}

export default WorkScheduleFilter;
