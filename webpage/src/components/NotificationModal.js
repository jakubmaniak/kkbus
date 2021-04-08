import React from 'react';
import Modal from './Modal';

function NotificationModal(props) {
    return (
        <Modal visible={modalDeleteRewardVisibility}>
                <header>{props.header}</header>
                <section className="content">
                    <p>Czy na pewno chcesz usunąć {props.name}?</p>
                </section>
                <section className="footer">
                    <div>
                        <button onClick={props.modalVisibility}>Anuluj</button>
                        <button className="delete" onClick={props.delete}>Tak, usuń</button>
                    </div>
                </section>
            </Modal>
    )
}

export default NotificationModal
