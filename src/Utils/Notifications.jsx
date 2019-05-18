import React, { Component } from 'react';

import axios from 'axios';
import qs from 'qs';
import $ from 'jquery';
import { serverStore, notifiStore } from '../App';
import Config from './Config';

class Notifi extends Component {
    constructor(props) {
        super(props);
        this.state = { notifiList: [], ready: false };
        this.GetNotifi = this.GetNotifi.bind(this);
        this.SetNotifiRead = this.SetNotifiRead.bind(this);
        this.SendNotifi = this.SendNotifi.bind(this);
    }

    componentDidMount() {
        let th = this;
        if (serverStore.getState().length <= 0) {
            serverStore.getServerData(() => {
                notifiStore.getNotifications(data => {
                    th.setState(
                        {
                            notifiList: data,
                            ready: true
                        },
                        () => {
                            if (data.length === 0) {
                                $('#gwt-uid-258').hide();
                            } else {
                                $('#gwt-uid-260').hide();
                                $('#gwt-uid-258').html(data.length);
                            }
                            $(document).on('click', 'i.fa-close', function () {
                                $(this)
                                    .closest('.BWPQWAD-S-N')
                                    .fadeOut(350, function () {
                                        th.SetNotifiRead($(this).data('id'));
                                        $(this).hide();
                                        let len = $('.BWPQWAD-S-N:visible')
                                            .length;
                                        $('#gwt-uid-258').html(len);
                                        if (len === 0) {
                                            $('#gwt-uid-260').show();
                                            $('#gwt-uid-258').hide();
                                        }
                                    });
                            });

                            $('#sendNotifi').off('click');
                            $('#sendNotifi').on('click', function () {
                                th.SendNotifi(
                                    $('#notifiTitle').val(),
                                    $('#notifiContent').val()
                                );
                            });
                        }
                    );
                });
            });
        } else {
            notifiStore.getNotifications(data => {
                th.setState(
                    {
                        notifiList: data,
                        ready: true
                    },
                    () => {
                        if (data.length === 0) {
                            $('#gwt-uid-258').hide();
                        } else {
                            $('#gwt-uid-260').hide();
                            $('#gwt-uid-258').html(data.length);
                        }
                        $(document).on('click', 'i.fa-close', function () {
                            $(this)
                                .closest('.BWPQWAD-S-N')
                                .fadeOut(350, function () {
                                    th.SetNotifiRead($(this).data('id'));
                                    $(this).hide();
                                    let len = $('.BWPQWAD-S-N:visible').length;
                                    $('#gwt-uid-258').html(len);
                                    if (len === 0) {
                                        $('#gwt-uid-260').show();
                                        $('#gwt-uid-258').hide();
                                    }
                                });
                        });

                        $('#sendNotifi').off('click');
                        $('#sendNotifi').on('click', function () {
                            th.SendNotifi(
                                $('#notifiTitle').val(),
                                $('#notifiContent').val()
                            );
                        });
                    }
                );
            });
        }
    }

    SetNotifiRead(not_id) {
        axios
            .post(
                Config.urls.setNotifiRead,
                qs.stringify({ not_id: not_id, user_id: Config.user_id })
            )
            .catch(function (error) {
                console.log(error);
            });
    }

    SendNotifi(title, desc) {
        axios
            .post(
                Config.urls.sendNotification,
                qs.stringify({ title: title, content: desc })
            )
            .catch(function (error) {
                console.log(error);
            });
    }

    GetNotifi() {
        let nots = this.state.notifiList;
        let _notifis = null;
        let notifis = null;
        let add_not = null;

        if (nots.length === 0) {
            _notifis = (
                <div className="BWPQWAD-S-C" id="gwt-uid-260">
                    <div className="BWPQWAD-S-D">Wszystko przeczytane</div>
                </div>
            );
        } else {
            _notifis = (
                <div
                    className="BWPQWAD-S-C"
                    id="gwt-uid-260"
                    style={{ display: 'none' }}
                >
                    <div className="BWPQWAD-S-D">Wszystko przeczytane</div>
                </div>
            );
            notifis = nots.map(not => (
                <div className="BWPQWAD-S-N" data-id={not.id} key={not.id}>
                    <div>
                        <span className="BWPQWAD-S-T">{not.title}</span>
                        <span className="BWPQWAD-S-c">
                            <i className="fa fa-close" />
                        </span>
                    </div>
                    <div className="BWPQWAD-S-e">{not.desc}</div>
                </div>
            ));
        }

        if (Config.user_id === 1 && this.state.ready) {
            add_not = (
                <span
                    className="badge"
                    style={{ cursor: 'pointer' }}
                    data-toggle="modal"
                    data-target="#addNotifi"
                >
                    <i className="fa fa-plus" />
                </span>
            );
        }

        return (
            <span className="BWPQWAD-S-u">
                <button
                    id="notifi"
                    className="BWPQWAD-S-b"
                    title="Powiadomienia"
                    style={{ color: '#3399FF' }}
                >
                    <i className="fa fa-bell" />{' '}
                    <span className="badge BWPQWAD-S-B" id="gwt-uid-258" />
                </button>
                <div id="notifi-panel" className="BWPQWAD-S-k BWPQWAD-S-n">
                    <span className="BWPQWAD-S-m" />
                    <span className="BWPQWAD-S-l" />
                    <div className="BWPQWAD-S-w">
                        <div className="BWPQWAD-S-o">
                            <span className="BWPQWAD-S-r">
                                Powiadomenia {add_not}
                            </span>
                        </div>
                        <div className="BWPQWAD-S-v">
                            <div>
                                {_notifis}
                                {notifis}
                            </div>
                        </div>
                    </div>
                </div>
            </span>
        );
    }

    render() {
        return <this.GetNotifi />;
    }
}

export default Notifi;
