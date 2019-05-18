import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Config from '../Utils/Config';
import { serverStore, DeleteNetworkDB, LogToDatabase } from '../App';
import $ from 'jquery';
import axios from 'axios';
import qs from 'qs';

class NetworkSettings extends Component {
    constructor(props) {
        super(props);
        this.state = { apis: null };
        this.MapMenu = this.MapMenu.bind(this);
        this.DeleteNetwork = this.DeleteNetwork.bind(this);
        this.ApiModal = this.ApiModal.bind(this);
        this.AddApi = this.AddApi.bind(this);
        this.EditApiModal = this.EditApiModal.bind(this);
        this.EditApi = this.EditApi.bind(this);
        this.DeleteApi = this.DeleteApi.bind(this);
    }

    componentWillMount() {
        const th = this;
        if (serverStore.getState().length <= 0) {
            serverStore.getServerData(data => {
                axios
                    .post(
                        Config.urls.getNetworkApis,
                        qs.stringify({
                            net_id: Config.network.net_id
                        })
                    )
                    .then(response => {
                        th.setState({
                            apis: response.data
                        });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            });
        }
    }

    componentDidMount() {
        const th = this;

        axios
            .post(
                Config.urls.getNetworkApis,
                qs.stringify({
                    net_id: Config.network.net_id
                })
            )
            .then(response => {
                th.setState({
                    apis: response.data
                });
            })
            .catch(error => {
                console.log(error);
            });

        (() => {
            $('#deleteNetwork').off('click');
            $('#addApi').off('click');
            $('#editApi').off('click');
            $('#delApi').off('click');

            $('#deleteNetwork').on('click', () => {
                th.DeleteNetwork();
            });
            $('#addApi').on('click', () => {
                th.AddApi();
            });
            $('#editApi').on('click', () => {
                th.EditApi();
            });
            $('#delApi').on('click', () => {
                th.DeleteApi();
            });
        })();
    }

    DeleteNetwork() {
        DeleteNetworkDB(() => {
            window.location.reload();
        });
    }

    AddApi() {
        let th = this;
        let key = $('#apiKey')
            .val()
            .trim();
        let title = $('#apiTitle')
            .val()
            .trim();
        let api = $('#apiSite').prop('selectedIndex') + 1;

        axios
            .post(
                Config.urls.addApiAccount,
                qs.stringify({
                    net_id: Config.network.net_id,
                    api_id: api,
                    api_title: title,
                    api_key: key
                })
            )
            .then(response => {
                LogToDatabase(
                    'Add API account ' + api + ' ' + title + ' ' + key
                );
                axios
                    .post(
                        Config.urls.getNetworkApis,
                        qs.stringify({
                            net_id: Config.network.net_id
                        })
                    )
                    .then(response => {
                        th.setState({
                            apis: response.data
                        });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            })
            .catch(error => {
                console.log(error);
            });
    }

    ApiModal(e) {
        let api = e.target.dataset.api;
        $('#apiSite')
            .prop('selectedIndex', api - 1)
            .change();
    }

    EditApi() {
        let th = this;
        let id = $('#editApiId').val();
        let key = $('#editApiKey')
            .val()
            .trim();
        let title = $('#editApiTitle')
            .val()
            .trim();
        let api = $('#editApiSite').prop('selectedIndex') + 1;

        axios
            .post(
                Config.urls.editApiAccount,
                qs.stringify({
                    id: id,
                    api_id: api,
                    api_title: title,
                    api_key: key
                })
            )
            .then(response => {
                LogToDatabase(
                    'Edit API account ' + api + ' ' + title + ' ' + key
                );
                axios
                    .post(
                        Config.urls.getNetworkApis,
                        qs.stringify({
                            net_id: Config.network.net_id
                        })
                    )
                    .then(response => {
                        th.setState({
                            apis: response.data
                        });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            })
            .catch(error => {
                console.log(error);
            });
    }

    EditApiModal(e) {
        let data = e.target.dataset;
        let id = data.id;
        let api = data.api;
        let key = data.key.trim();
        let title = data.title.trim();
        $('#editApiId').val(id);
        $('#editApiSite')
            .prop('selectedIndex', api - 1)
            .change();
        $('#editApiTitle').val(title);
        $('#editApiKey').val(key);
    }

    DeleteApi() {
        let th = this;
        let id = $('#editApiId').val();
        let title = $('#editApiTitle').val();
        let key = $('#editApiKey').val();

        axios
            .post(
                Config.urls.deleteApiAccount,
                qs.stringify({
                    id: id
                })
            )
            .then(response => {
                LogToDatabase(
                    'Delete API account ' + id + ' ' + title + ' ' + key
                );
                axios
                    .post(
                        Config.urls.getNetworkApis,
                        qs.stringify({
                            net_id: Config.network.net_id
                        })
                    )
                    .then(response => {
                        th.setState({
                            apis: response.data
                        });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            })
            .catch(error => {
                console.log(error);
            });
    }

    MapMenu(props) {
        let content;

        if (!Config.network.web_page) {
            content = (
                <div className="BWPQWAD-S-C">
                    <div className="BWPQWAD-S-d">
                        Brak przypisanej sieci do konta.<br />
                        <br />
                        <button
                            className="BWPQWAD-f-a BWPQWAD-de-a BWPQWAD-f-r"
                            onClick={() =>
                                this.props.history.push('/AddNetwork')
                            }
                        >
                            <div className="BWPQWAD-f-m">
                                <i className="fa fa-plus BWPQWAD-l-cb" />
                                <span className="BWPQWAD-k-u">Dodaj sieć</span>
                            </div>
                        </button>
                    </div>
                </div>
            );
        } else {
            let deletebutton, apis_list;
            if (Config.network.owner) {
                deletebutton = (
                    <span className="BWPQWAD-m-k BWPQWAD-Tg-t BWPQWAD-k-s">
                        <NavLink
                            to={'/#'}
                            data-toggle="modal"
                            data-target="#netModal"
                        >
                            Usuń sieć
                        </NavLink>
                    </span>
                );
            }

            let apis = this.state.apis || null,
                apisList = [];
            if (apis && apis.length > 0) {
                for (let i in apis) {
                    apisList.push(apis[i]);
                }
                apis_list = apisList.map(api => (
                    <div className="BWPQWAD-Ym-b BWPQWAD-k-K" key={api.id}>
                        <div>
                            <span>{api.name}</span>{' '}
                            <i
                                className="fa fa-plus"
                                data-toggle="modal"
                                data-target="#apiModal"
                                onClick={this.ApiModal}
                                data-api={api.id}
                            />
                        </div>
                        <ul>
                            {api.accounts.map(acc => (
                                <li key={acc.id}>
                                    <i
                                        className="fa fa-pencil"
                                        data-toggle="modal"
                                        data-target="#editApiModal"
                                        onClick={this.EditApiModal}
                                        data-id={acc.id}
                                        data-api={acc.api_id}
                                        data-key={acc.api_key}
                                        data-title={acc.title}
                                    />{' '}
                                    {acc.title} - {acc.api_key}
                                </li>
                            ))}
                        </ul>
                    </div>
                ));
            }

            content = (
                <div className="BWPQWAD-N-a" id="gwt-uid-252">
                    <div className="BWPQWAD-m-i">
                        <div className="BWPQWAD-Tg-g">
                            <header className="BWPQWAD-k-v">
                                <div className="BWPQWAD-m-d BWPQWAD-Tg-k">
                                    <div className="BWPQWAD-Tg-i">
                                        <div className="BWPQWAD-k-s BWPQWAD-m-l BWPQWAD-Tg-D">
                                            {Config.network.web_page + ' #' + Config.network.net_id}
                                        </div>
                                        <div className="BWPQWAD-Tg-e">
                                            <span className="BWPQWAD-m-k BWPQWAD-Tg-t BWPQWAD-k-s">
                                                {Config.network.date}
                                            </span>
                                            {deletebutton}
                                        </div>
                                        <div className="BWPQWAD-Tg-y BWPQWAD-k-s">
                                            <span className="BWPQWAD-Tg-x">
                                                <span
                                                    style={{
                                                        color: '#84a000',
                                                        textTransform: 'none'
                                                    }}
                                                >
                                                    {'Właściciel: ' + Config.network.ownerName}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    {/* <div>
                                        <button
                                            className="BWPQWAD-f-a BWPQWAD-de-a BWPQWAD-f-r"
                                            onClick={() =>
                                                this.props.history.push(
                                                    '/ChargeWallet'
                                                )
                                            }
                                        >
                                            <div className="BWPQWAD-f-m">
                                                <i className="fa fa-usd BWPQWAD-l-cb" />
                                                <span className="BWPQWAD-k-u">
                                                    Stan konta:{' '}
                                                    {Config.network.balance}zł
                                                </span>
                                            </div>
                                        </button>
                                    </div> */}
                                </div>
                            </header>
                        </div>
                        <div>
                            <div className="BWPQWAD-n-a">
                                <sidebar className="BWPQWAD-p-c BWPQWAD-B-c">
                                    <nav>
                                        <ol>
                                            <li>
                                                <NavLink to={`/AccountNetwork`}>
                                                    <span>Współdzielenie</span>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink
                                                    to={`/NetworkServices`}
                                                >
                                                    <span>Usługi</span>
                                                </NavLink>
                                            </li>
                                            <li className="BWPQWAD-n-f">
                                                <NavLink
                                                    to={`/NetworkSettings`}
                                                    onClick={e =>
                                                        e.preventDefault()
                                                    }
                                                >
                                                    <span>Ustawienia API</span>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to={`/NetworkCodes`}>
                                                    <span>Kody SMS</span>
                                                </NavLink>
                                            </li>
                                        </ol>
                                    </nav>
                                </sidebar>
                                <aside />
                                <div>
                                    <div className="BWPQWAD-Eh-a">
                                        <div className="BWPQWAD-Gl-b">
                                            <section>
                                                <div className="BWPQWAD-Gl-c">
                                                    {apis_list}
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return content;
    }

    render() {
        return <this.MapMenu />;
    }
}

export default NetworkSettings;
