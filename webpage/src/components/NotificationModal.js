import React from 'react';
import Modal from './Modal';

function NotificationModal(props) {
    return (
        <Modal visible={props.visible}>
            <header>{props.header}</header>
            <section className="content">
                <p>Czy na pewno chcesz usunąć {props.name}?</p>
            </section>
            <section className="footer">
                <div>
                    <button onClick={props.notificationModalExit}>Anuluj</button>
                    <button className="delete" onClick={props.delete}>Tak, usuń</button>
                </div>
            </section>
        </Modal>
    )
}

export default NotificationModal
