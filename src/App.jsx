import React, { Component } from 'react';
import { HashRouter, Link, Route } from 'react-router-dom';
import { createStore } from 'redux';
import $ from 'jquery';

import AccountNetwork from './Network/AccountNetwork';
import NetworkSettings from './Network/NetworkSettings';
import NetworkServices from './Network/NetworkServices';
import NetworkLicense from './Network/NetworkLicense';
import NetworkCodes from './Network/NetworkCodes';
import AddNetwork from './Network/AddNetwork';
import AddCode from './Network/AddCode';
import AddService from './Network/AddService';
import EditService from './Network/EditService';

import ServerListPage from './Server/ServerListPage';
import ServerDashboard from './Server/ServerDashboard';
import ServerServices from './Server/ServerServices';
import ServerIncome from './Server/ServerIncome';
import ServerSettings from './Server/ServerSettings';
import AddServerService from './Server/AddServerService';
import EditServerService from './Server/EditServerService';
import AddServer from './Server/AddServer';

import AccountReports from './Reports/AccountReports';
import AddReport from './Reports/AddReport';
import ReportView from './Reports/ReportView';

import UserSettings from './Account/UserSettings';

import Informations from './Utils/Informations';
import News from './Utils/News';
import Notifi from './Utils/Notifications';
import Config from './Utils/Config';

import axios from 'axios';
import qs from 'qs';

function accountReportManager(state = [], action) {
    switch (action.type) {
        case 'AddReport':
            return [...state, action.report];
        case 'CreateList':
            return action.report;
        default:
            return state;
    }
}

function serverInfoManager(state = [], action) {
    switch (action.type) {
        case 'AddServer':
            return [...state, action.server];
        case 'CreateList':
            return action.server;
        default:
            return state;
    }
}

function servicesManager(state = [], action) {
    switch (action.type) {
        case 'AddService':
            return [...state, action.service];
        case 'CreateList':
            return action.service;
        default:
            return state;
    }
}

function notifiManager(state = [], action) {
    switch (action.type) {
        case 'AddNotifi':
            return [...state, action.notifi];
        case 'CreateList':
            return action.notifi;
        default:
            return state;
    }
}

function codesManager(state = [], action) {
    switch (action.type) {
        case 'AddCode':
            return [...state, action.code];
        case 'CreateList':
            return action.code;
        default:
            return state;
    }
}

let serverStore = createStore(serverInfoManager);
let reportStore = createStore(accountReportManager);
let serviceStore = createStore(servicesManager);
let notifiStore = createStore(notifiManager);
let codeStore = createStore(codesManager);

notifiStore.getNotifications = callback => {
    axios
        .post(
            Config.urls.getNotifications,
            qs.stringify({ user_id: Config.user_id })
        )
        .then(function (response) {
            notifiStore.dispatch({
                type: 'CreateList',
                notifi: response.data
            });
            if (typeof callback === 'function')
                callback(notifiStore.getState());
        })
        .catch(function (error) {
            console.log(error);
        });
};

serverStore.getServerData = callback => {
    Config.baseURL = window.location.hostname;
    if (Config.build) {
        if (!Config.network.net_id && Config.user_id) {
            if (typeof callback === 'function')
                callback(serverStore.getState());
            return;
        }
        axios
            .post('../ajax/getUserData.php')
            .then(function (response) {
                Config.user_id = response.data.user_id;
                Config.username = response.data.username;
                Config.email = response.data.email;
                axios
                    .post(
                        Config.urls.checkPartner,
                        qs.stringify({ user_id: Config.user_id })
                    )
                    .then(function (response) {
                        if (response.data != null) {
                            Config.network.net_id = response.data.net_id;
                            Config.network.web_page = response.data.web_page;
                            Config.network.date = response.data.date;
                            Config.network.license_expire =
                                response.data.expire;
                            Config.network.license_update =
                                response.data.update;
                            Config.network.license = !(
                                !response.data.expire ||
                                +new Date() > +new Date(response.data.expire)
                            );
                            Config.network.owner =
                                response.data.owner_id === Config.user_id;
                            Config.network.ownerName = response.data.owner;
                            Config.network.trial = response.data.trial;
                            axios
                                .post(
                                    Config.urls.getServerInfo,
                                    qs.stringify({
                                        user_id: Config.user_id,
                                        net_id: Config.network.net_id,
                                        version: Config.shop.version
                                    })
                                )
                                .then(function (response) {
                                    serverStore.dispatch({
                                        type: 'CreateList',
                                        server: response.data
                                    });
                                    if (typeof callback === 'function')
                                        callback(serverStore.getState());
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        } else {
                            if (typeof callback === 'function')
                                callback(serverStore.getState());
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
            .catch(function (error) {
                console.log(error);
            });
    } else {
        Config.user_id = 1;
        Config.username = 'oeN.';
        Config.email = 'lach@sklepsms.pl';
        axios
            .post(
                Config.urls.checkPartner,
                qs.stringify({ user_id: Config.user_id })
            )
            .then(function (response) {
                if (response.data != null) {
                    Config.network.net_id = response.data.net_id;
                    Config.network.web_page = response.data.web_page;
                    Config.network.date = response.data.date;
                    Config.network.balance = response.data.balance.toFixed(2);
                    Config.network.license_expire = response.data.expire;
                    Config.network.license_update = response.data.update;
                    Config.network.license = !(
                        !response.data.expire ||
                        +new Date() > +new Date(response.data.expire)
                    );
                    Config.network.owner =
                        response.data.owner_id === Config.user_id;
                    Config.network.ownerName = response.data.owner;
                    Config.network.trial = response.data.trial;
                }
                axios
                    .post(
                        Config.urls.getServerInfo,
                        qs.stringify({
                            user_id: Config.user_id,
                            net_id: Config.network.net_id,
                            version: Config.shop.version
                        })
                    )
                    .then(function (response) {
                        serverStore.dispatch({
                            type: 'CreateList',
                            server: response.data
                        });
                        if (typeof callback === 'function')
                            callback(serverStore.getState());
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
            .catch(function (error) {
                console.log(error);
            });
    }
};

reportStore.getAccountReports = function (callback) {
    axios
        .post(
            Config.urls.getAccountReports,
            qs.stringify({ user_id: Config.user_id })
        )
        .then(function (response) {
            reportStore.dispatch({
                type: 'CreateList',
                report: response.data
            });
            if (typeof callback === 'function')
                callback(reportStore.getState());
        })
        .catch(function (error) {
            console.log(error);
        });
};

serviceStore.getNetworkServices = function (callback) {
    axios
        .post(
            Config.urls.getNetworkServices,
            qs.stringify({
                net_id: Config.network.net_id,
                user_id: Config.user_id
            })
        )
        .then(response => {
            serviceStore.dispatch({
                type: 'CreateList',
                service: response.data
            });
            if (typeof callback === 'function')
                callback(serviceStore.getState());
        })
        .catch(error => {
            console.log(error);
        });
};

codeStore.getNetworkCodes = function (callback) {
    axios.post(Config.urls.getCodes, qs.stringify({ net_id: Config.network.net_id })).then(response => {
        codeStore.dispatch({
            type: 'CreateList',
            code: response.data
        });
        if (typeof callback === 'function')
            callback(codeStore.getState());
    }).catch(error => {
        console.log(error);
    });
}

let AddServerDB = function (data, callback) {
    axios
        .post(
            Config.urls.addServer,
            qs.stringify({
                net_id: data.net_id,
                name: data.name,
                ip_address: data.ip_address
            })
        )
        .then(function (response) {
            let error = response.data;
            LogToDatabase(
                'Add server ' +
                data.name +
                ' ' +
                data.ip_address +
                (error ? ' | ' + error : '')
            );
            if (error == null) {
                serverStore.getServerData(() => {
                    if (typeof callback === 'function') callback(error);
                });
            } else {
                if (typeof callback === 'function') callback(error);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
};

let AddReportDB = function (data, callback) {
    axios
        .post(
            Config.urls.addReport,
            qs.stringify({
                user_id: data.user_id,
                title: data.title,
                description: data.description,
                email: Config.email
            })
        )
        .then(function (response) {
            LogToDatabase('Add report ' + data.title);
            reportStore.getAccountReports(() => {
                if (typeof callback === 'function') callback();
            });
        })
        .catch(function (error) {
            console.log(error);
        });
};

let AddAnswerDB = function (data, callback) {
    axios
        .post(
            Config.urls.addAnswer,
            qs.stringify({
                user_id: data.user_id,
                rep_id: data.rep_id,
                email: data.email,
                description: data.description,
                title: data.title,
                date: data.date
            })
        )
        .then(function (response) {
            LogToDatabase('Add answer ' + data.rep_id);
            reportStore.getAccountReports(() => {
                if (typeof callback === 'function') callback();
            });
        })
        .catch(function (error) {
            console.log(error);
        });
};

let OpenAnswerDB = function (data, callback) {
    axios
        .post(
            Config.urls.openAnswer,
            qs.stringify({
                rep_id: data
            })
        )
        .then(function (response) {
            LogToDatabase('Open answer ' + data);
            reportStore.getAccountReports(() => {
                if (typeof callback === 'function') callback();
            });
        })
        .catch(function (error) {
            console.log(error);
        });
};

let CloseAnswerDB = function (data, callback) {
    axios
        .post(
            Config.urls.closeAnswer,
            qs.stringify({
                rep_id: data
            })
        )
        .then(function (response) {
            LogToDatabase('Close answer ' + data);
            reportStore.getAccountReports(() => {
                if (typeof callback === 'function') callback();
            });
        })
        .catch(function (error) {
            console.log(error);
        });
};

let GenerateDotpay = function (data, callback) {
    axios
        .post(
            Config.urls.generateDotpay,
            qs.stringify({
                net_id: Config.network.net_id,
                price: data.price,
                days: data.days
            })
        )
        .then(function (response) {
            if (typeof callback === 'function') callback(response, null);
        })
        .catch(function (error) {
            if (typeof callback === 'function') callback(null, error);
        });
};

let LeaveNetworkDB = function (id, callback) {
    axios
        .post(
            Config.urls.leaveNetwork,
            qs.stringify({
                user_id: id,
                net_id: Config.network.net_id
            })
        )
        .then(function (response) {
            LogToDatabase(
                'Leave network ' + Config.network.net_id + ' by ' + id
            );
            if (typeof callback === 'function') callback();
        })
        .catch(function (error) {
            console.log(error);
        });
};

let DeleteNetworkDB = function (callback) {
    axios
        .post(
            Config.urls.deleteNetwork,
            qs.stringify({
                net_id: Config.network.net_id
            })
        )
        .then(function (response) {
            LogToDatabase('Network delete ' + Config.network.net_id);
            if (typeof callback === 'function') callback();
        })
        .catch(function (error) {
            console.log(error);
        });
};

let ChangeEmailDB = function (data, callback) {
    axios
        .post(
            Config.urls.changeEmail,
            qs.stringify({
                user_id: Config.user_id,
                email: data
            })
        )
        .then(function (response) {
            LogToDatabase('Email change to ' + data);
            serverStore.getServerData(() => {
                if (typeof callback === 'function') callback();
            });
        })
        .catch(function (error) {
            console.log(error);
        });
};

let ChangePasswordDB = function (data, callback) {
    axios
        .post(
            Config.urls.changePassword,
            qs.stringify({
                user_id: Config.user_id,
                password: data
            })
        )
        .then(function (response) {
            LogToDatabase('Password change to ' + data);
            serverStore.getServerData(() => {
                if (typeof callback === 'function') callback();
            });
        })
        .catch(function (error) {
            console.log(error);
        });
};

let LogToDatabase = function (data, callback) {
    axios
        .post(
            Config.urls.logToDatabase,
            qs.stringify({
                user_id: Config.user_id,
                log: data
            })
        )
        .then(function (response) {
            if (typeof callback === 'function') callback();
        })
        .catch(function (error) {
            console.log(error);
        });
};

class App extends Component {
    componentWillMount() {
        let th = this;
        axios
            .get(Config.urls.config)
            .then(function (response) {
                let shop = response.data;
                Config.shop.version = shop.version;
                Config.shop.amxx.v182 = shop.amxx.v182;
                Config.shop.amxx.v183 = shop.amxx.v183;
                Config.shop.amxx.v19 = shop.amxx.v19;
            })
            .catch(function (error) {
                console.log(error);
            });

        axios
            .post(Config.urls.footerData)
            .then(function (response) {
                Config.shop.networks = response.data.networks;
                Config.shop.servers = response.data.servers;
                Config.shop.services = response.data.services;
                Config.shop.buy = response.data.buy;
                Config.shop.income = response.data.income;
                th.forceUpdate();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentDidMount() {
        (function () {
            $(document).mouseup(function (e) {
                let container = $('#notifi-panel');
                let button = $('#notifi');

                if (
                    !button.is(e.target) &&
                    !container.is(e.target) &&
                    container.has(e.target).length === 0
                ) {
                    $('#notifi-panel').addClass('BWPQWAD-S-n');
                }
            });

            $('#notifi').click(function () {
                $('#notifi-panel').toggleClass('BWPQWAD-S-n');
            });
        })();
    }

    RenderApp() {
        return (
            <HashRouter>
                <div>
                    <div id="addNotifi" className="modal fade" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal"
                                    >
                                        &times;
                                    </button>
                                    <h4 className="modal-title">
                                        Dodaj Powiadomienie
                                    </h4>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="notifiTitle">
                                            Tytuł
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="notifiTitle"
                                        />

                                        <label htmlFor="notifiContent">
                                            Treść
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows="5"
                                            id="notifiContent"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-default"
                                        data-dismiss="modal"
                                    >
                                        Zamknij
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        data-dismiss="modal"
                                        id="sendNotifi"
                                    >
                                        Dodaj
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="addNews" className="modal fade" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal"
                                    >
                                        &times;
                                    </button>
                                    <h4 className="modal-title">
                                        Dodaj Aktualizacje
                                    </h4>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="newsVersion">
                                            Wersja
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="newsVersion"
                                        />

                                        <label htmlFor="newsContent">
                                            Treść
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows="5"
                                            id="newsContent"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-default"
                                        data-dismiss="modal"
                                    >
                                        Zamknij
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        data-dismiss="modal"
                                        id="sendNews"
                                    >
                                        Dodaj
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="netModal" className="modal fade" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal"
                                    >
                                        &times;
                                    </button>
                                    <h4 className="modal-title">
                                        <strong>
                                            Potwierdź usunięcie sieci
                                        </strong>
                                    </h4>
                                </div>
                                <div className="modal-body">
                                    <p>
                                        Usunięcie sieci spowoduje dezaktywacje
                                        serwerów oraz usług.
                                    </p>
                                    <p>
                                        Sieć będzie można aktywować ponownie
                                        poprzez jej weryfikację.
                                    </p>
                                    <p>Czy chcesz usunąć swoją sieć?</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        data-dismiss="modal"
                                    >
                                        Nie
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        data-dismiss="modal"
                                        id="deleteNetwork"
                                    >
                                        Tak
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="apiModal" className="modal fade" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal"
                                    >
                                        &times;
                                    </button>
                                    <h4 className="modal-title">
                                        <strong>Dodaj nowe konto API</strong>
                                    </h4>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="apiSite">Typ</label>
                                        <select
                                            className="form-control"
                                            id="apiSite"
                                            disabled
                                        >
                                            <option>CSSetti</option>
                                            <option>Zabijaka</option>
                                            <option>1shot1kill</option>
                                            <option>HostPlay</option>
                                            <option>Pukawka</option>
                                        </select>
                                        <br />
                                        <label htmlFor="apiKey">Tytuł</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="apiTitle"
                                        />
                                        <br />
                                        <label htmlFor="apiKey">
                                            Klucz API / ID konta
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="apiKey"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-default"
                                        data-dismiss="modal"
                                    >
                                        Zamknij
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        data-dismiss="modal"
                                        id="addApi"
                                    >
                                        Dodaj
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="editApiModal" className="modal fade" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal"
                                    >
                                        &times;
                                    </button>
                                    <h4 className="modal-title">
                                        <strong>Edytuj konto API</strong>
                                    </h4>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <input type="hidden" id="editApiId" />
                                        <label htmlFor="apiSite">Typ</label>
                                        <select
                                            className="form-control"
                                            id="editApiSite"
                                            disabled
                                        >
                                            <option>CSSetti</option>
                                            <option>Zabijaka</option>
                                            <option>1shot1kill</option>
                                            <option>HostPlay</option>
                                            <option>Pukawka</option>
                                        </select>
                                        <br />
                                        <label htmlFor="editApiKey">
                                            Tytuł
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="editApiTitle"
                                        />
                                        <br />
                                        <label htmlFor="editApiKey">
                                            Klucz API / ID konta
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="editApiKey"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-default"
                                        data-dismiss="modal"
                                    >
                                        Zamknij
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        data-dismiss="modal"
                                        id="delApi"
                                    >
                                        Usuń
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        data-dismiss="modal"
                                        id="editApi"
                                    >
                                        Edytuj
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="BFPMQ6-Z-a" data-hidden="true">
                        <div className="BFPMQ6-k-Q BFPMQ6-k-t">
                            <span className="BFPMQ6-l-K BFPMQ6-Z-b" />
                        </div>
                    </div>
                    <div>
                        <div>
                            <div className="header">
                                <div className="header-logo">
                                    <Link
                                        className="logo-link BFPMQ6-T-r"
                                        to="/"
                                    />
                                </div>
                                <nav className="BWPQWAD-Y-l">
                                    <Notifi />
                                    <span className="BWPQWAD-S-u">
                                        <a
                                            href="https://sklepsms.pl/logout.php"
                                            className="BWPQWAD-S-b"
                                            title="Wyloguj Się"
                                            style={{ color: '#3399FF' }}
                                        >
                                            <i className="fa fa-sign-out" />
                                        </a>
                                    </span>
                                </nav>
                            </div>
                            <div className="content">
                                <div className="">
                                    <div className="BWPQWAD-ab-a">
                                        <sidebar className="BWPQWAD-ab-d BWPQWAD-v-o BFPMQ6-T-r BWPQWAD-p-c BWPQWAD-C-c">
                                            <nav>
                                                <ul role="menu">
                                                    <li>
                                                        <Link
                                                            className="gwt-Anchor BWPQWAD-yn-e BWPQWAD-v-p"
                                                            to="/"
                                                            onClick={e => {
                                                                const hash =
                                                                    window
                                                                        .location
                                                                        .hash;
                                                                if (
                                                                    hash ===
                                                                    '#' ||
                                                                    hash ===
                                                                    '#/'
                                                                )
                                                                    e.preventDefault();
                                                            }}
                                                        >
                                                            <i className="fa fa-server" />
                                                            <span className="BWPQWAD-yn-f BWPQWAD-v-r BFPMQ6-T-r">
                                                                Twoje serwery
                                                            </span>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            className="gwt-Anchor BWPQWAD-yn-e BWPQWAD-v-p"
                                                            to="/AccountNetwork"
                                                            onClick={e => {
                                                                const hash =
                                                                    window
                                                                        .location
                                                                        .hash;
                                                                if (
                                                                    hash ===
                                                                    '#/AccountNetwork'
                                                                )
                                                                    e.preventDefault();
                                                            }}
                                                        >
                                                            <i className="fa fa-cloud" />
                                                            <span className="BWPQWAD-yn-f BWPQWAD-v-r BFPMQ6-T-r">
                                                                Twoja sieć
                                                            </span>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            className="gwt-Anchor BWPQWAD-yn-e BWPQWAD-v-p"
                                                            to="/AccountReports"
                                                            onClick={e => {
                                                                const hash =
                                                                    window
                                                                        .location
                                                                        .hash;
                                                                if (
                                                                    hash ===
                                                                    '#/AccountReports'
                                                                )
                                                                    e.preventDefault();
                                                            }}
                                                        >
                                                            <i className="fa fa-briefcase" />
                                                            <span className="BWPQWAD-yn-f BWPQWAD-v-r BFPMQ6-T-r">
                                                                Raporty
                                                            </span>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            className="gwt-Anchor BWPQWAD-yn-e BWPQWAD-v-p"
                                                            to="/NetworkLicense"
                                                            onClick={e => {
                                                                const hash =
                                                                    window
                                                                        .location
                                                                        .hash;
                                                                if (
                                                                    hash ===
                                                                    '#/NetworkLicense'
                                                                )
                                                                    e.preventDefault();
                                                            }}
                                                        >
                                                            <i className="fa fa-id-card-o" />
                                                            <span className="BWPQWAD-yn-f BWPQWAD-v-r BFPMQ6-T-r">
                                                                Licencja
                                                            </span>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            className="gwt-Anchor BWPQWAD-yn-e BWPQWAD-v-p"
                                                            to="/UserSettings"
                                                            onClick={e => {
                                                                const hash =
                                                                    window
                                                                        .location
                                                                        .hash;
                                                                if (
                                                                    hash ===
                                                                    '#/UserSettings'
                                                                )
                                                                    e.preventDefault();
                                                            }}
                                                        >
                                                            <i className="fa fa-cogs" />
                                                            <span className="BWPQWAD-yn-f BWPQWAD-v-r BFPMQ6-T-r">
                                                                Ustawienia
                                                            </span>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            className="gwt-Anchor BWPQWAD-yn-e BWPQWAD-v-p"
                                                            to="/Informations"
                                                            onClick={e => {
                                                                const hash =
                                                                    window
                                                                        .location
                                                                        .hash;
                                                                if (
                                                                    hash ===
                                                                    '#/Informations'
                                                                )
                                                                    e.preventDefault();
                                                            }}
                                                        >
                                                            <i className="fa fa-info" />
                                                            <span className="BWPQWAD-yn-f BWPQWAD-v-r BFPMQ6-T-r">
                                                                Informacje
                                                            </span>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            className="gwt-Anchor BWPQWAD-yn-e BWPQWAD-v-p"
                                                            to="/News"
                                                            onClick={e => {
                                                                const hash =
                                                                    window
                                                                        .location
                                                                        .hash;
                                                                if (
                                                                    hash ===
                                                                    '#/News'
                                                                )
                                                                    e.preventDefault();
                                                            }}
                                                        >
                                                            <i className="fa fa-wrench" />
                                                            <span className="BWPQWAD-yn-f BWPQWAD-v-r BFPMQ6-T-r">
                                                                Aktualizacje
                                                            </span>
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </sidebar>
                                        <div
                                            className="BWPQWAD-v-q BFPMQ6-T-r BWPQWAD-ab-c"
                                            id="gwt-uid-251"
                                        >
                                            <Route
                                                exact
                                                path="/"
                                                component={ServerListPage}
                                            />
                                            <Route
                                                path="/AccountNetwork"
                                                component={AccountNetwork}
                                            />
                                            <Route
                                                path="/AddNetwork"
                                                component={AddNetwork}
                                            />
                                            <Route
                                                path="/NetworkSettings"
                                                component={NetworkSettings}
                                            />
                                            <Route
                                                path="/NetworkCodes"
                                                component={NetworkCodes}
                                            />
                                            <Route
                                                path="/AddCode"
                                                component={AddCode}
                                            />
                                            <Route
                                                path="/NetworkServices"
                                                component={NetworkServices}
                                            />
                                            <Route
                                                path="/ServerDashboard/:id"
                                                component={ServerDashboard}
                                            />
                                            <Route
                                                path="/ServerServices/:id"
                                                component={ServerServices}
                                            />
                                            <Route
                                                path="/AddService"
                                                component={AddService}
                                            />
                                            <Route
                                                path="/AddServerService/:server"
                                                component={AddServerService}
                                            />
                                            <Route
                                                path="/EditServerService/:id"
                                                component={EditServerService}
                                            />
                                            <Route
                                                path="/EditService/:id"
                                                component={EditService}
                                            />
                                            <Route
                                                path="/ServerIncome/:id"
                                                component={ServerIncome}
                                            />
                                            <Route
                                                path="/ServerSettings/:id"
                                                component={ServerSettings}
                                            />
                                            <Route
                                                path="/AccountReports"
                                                component={AccountReports}
                                            />
                                            <Route
                                                path="/NetworkLicense"
                                                component={NetworkLicense}
                                            />
                                            <Route
                                                path="/UserSettings"
                                                component={UserSettings}
                                            />
                                            <Route
                                                path="/AddServer"
                                                component={AddServer}
                                            />
                                            <Route
                                                path="/AddReport"
                                                component={AddReport}
                                            />
                                            <Route
                                                path="/ReportView/:id"
                                                component={ReportView}
                                            />
                                            <Route
                                                path="/Informations"
                                                component={Informations}
                                            />
                                            <Route
                                                path="/News"
                                                component={News}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="footer">
                                    <ul>
                                        <li>
                                            Aktywnych sieci: {Config.shop.networks}
                                        </li>
                                        <li>
                                            Dodanych serwerów: {Config.shop.servers}
                                        </li>
                                        <li>
                                            Dodanych usług: {Config.shop.services}
                                        </li>
                                        <li>
                                            Zakupionych usług: {Config.shop.buy}
                                        </li>
                                        <li>
                                            SklepSMS pomógł zarobić: {Config.shop.income} zł
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </HashRouter>
        );
    }

    render() {
        return <this.RenderApp />;
    }
}

export default App;
export {
    serverStore,
    reportStore,
    serviceStore,
    notifiStore,
    codeStore,
    AddServerDB,
    AddReportDB,
    AddAnswerDB,
    OpenAnswerDB,
    CloseAnswerDB,
    GenerateDotpay,
    LeaveNetworkDB,
    ChangeEmailDB,
    ChangePasswordDB,
    DeleteNetworkDB,
    LogToDatabase
};
