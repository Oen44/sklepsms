import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Config from '../Utils/Config';
import {
    serverStore,
    DeleteNetworkDB,
    LeaveNetworkDB,
    LogToDatabase
} from '../App';
import $ from 'jquery';
import axios from 'axios';
import qs from 'qs';

class AccountNetwork extends Component {
    constructor(props) {
        super(props);
        this.state = {
            partners: null
        };
        this.MapServers = this.MapServers.bind(this);
        this.DeleteNetwork = this.DeleteNetwork.bind(this);
        this.DeletePartner = this.DeletePartner.bind(this);
        this.AddPartner = this.AddPartner.bind(this);
        this.PartnerName = this.PartnerName.bind(this);
    }

    componentWillMount() {
        const th = this;
        if (serverStore.getState().length <= 0) {
            serverStore.getServerData(data => {
                th.setState(
                    prev => {
                        return (th.state = prev);
                    },
                    () => {
                        axios
                            .post(
                                Config.urls.getPartners,
                                qs.stringify({
                                    net_id: Config.network.net_id
                                })
                            )
                            .then(response => {
                                th.setState({
                                    partners: response.data
                                });
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                );
            });
        } else {
            axios
                .post(
                    Config.urls.getPartners,
                    qs.stringify({
                        net_id: Config.network.net_id
                    })
                )
                .then(response => {
                    th.setState({
                        partners: response.data
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    componentDidMount() {
        const th = this;
        (() => {
            $('#deleteNetwork').off('click');
            $('#deleteNetwork').on('click', () => {
                th.DeleteNetwork();
            });
        })();
    }

    PartnerName(e) {
        const partner = e.target.value || null;
        if (partner) {
            this.setState({
                partnerName: partner
            });
        }
    }

    AddPartner(e) {
        const partner = this.state.partnerName || null;
        const th = this;
        if (partner) {
            axios
                .post(
                    Config.urls.addPartner,
                    qs.stringify({
                        net_id: Config.network.net_id,
                        partner: partner
                    })
                )
                .then(response => {
                    LogToDatabase('Add partner ' + partner);
                    axios
                        .post(
                            Config.urls.getPartners,
                            qs.stringify({
                                net_id: Config.network.net_id
                            })
                        )
                        .then(response => {
                            th.setState({
                                partners: response.data
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
    }

    DeletePartner(e) {
        const id = e.target.dataset.id;
        const th = this;
        LeaveNetworkDB(id, () => {
            axios
                .post(
                    Config.urls.getPartners,
                    qs.stringify({
                        net_id: Config.network.net_id
                    })
                )
                .then(response => {
                    th.setState({
                        partners: response.data
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        });
    }

    DeleteNetwork() {
        DeleteNetworkDB(() => {
            window.location.reload();
        });
    }

    MapServers(props) {
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
            let deletebutton,
                table,
                partners = null,
                addbutton;
            if (Config.network.owner) {
                let partnersInfo = this.state.partners || null;
                if (partnersInfo) {
                    partners = partnersInfo.map(partner => (
                        <tr key={partner.id}>
                            <td className="BWPQWAD-Xc-a BWPQWAD-Xc-c BWPQWAD-Xc-d">
                                <strong>{partner.username}</strong>
                            </td>
                            <td className="BWPQWAD-Xc-a BWPQWAD-Xc-c BWPQWAD-Xc-d">
                                <button
                                    className="btn btn-danger"
                                    data-id={partner.id}
                                    onClick={this.DeletePartner}
                                >
                                    <i className="fa fa-trash" /> Usuń
                                </button>
                            </td>
                        </tr>
                    ));
                }
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
                if (partnersInfo && partnersInfo.length > 0) {
                    table = (
                        <table className="BWPQWAD-t-T">
                            <thead>
                                <tr>
                                    <th
                                        className="BWPQWAD-Xc-h"
                                        style={{ paddingLeft: '35px' }}
                                    >
                                        Użytkownik
                                </th>
                                    <th className="BWPQWAD-Xc-h"> Opcje </th>
                                </tr>
                            </thead>
                            <colgroup>
                                <col style={{ width: '20%' }} />
                                <col style={{ width: '80%' }} />
                            </colgroup>
                            <tbody>{partners}</tbody>
                        </table>
                    );
                }
                else {
                    table = (
                        <div className="BWPQWAD-S-C">
                            <div className="BWPQWAD-S-d">Brak partnerów.</div>
                        </div>
                    );
                }
                addbutton = (
                    <div>
                        <input
                            type="text"
                            placeholder="Użytkownik"
                            className="gwt-TextBox BWPQWAD-Am-d"
                            style={{ marginRight: 15 }}
                            onChange={this.PartnerName}
                        />
                        <button
                            className="BWPQWAD-f-a BWPQWAD-de-a BWPQWAD-f-r"
                            onClick={this.AddPartner}
                        >
                            <div className="BWPQWAD-f-m">
                                <i className="fa fa-plus BWPQWAD-l-cb" />
                                <span className="BWPQWAD-k-u"> Dodaj </span>
                            </div>
                        </button>
                    </div>
                );
            } else {
                deletebutton = null;
                table = (
                    <table className="BWPQWAD-t-T">
                        <thead>
                            <tr>
                                <th className="BWPQWAD-Xc-h"> Użytkownik </th>
                            </tr>
                        </thead>
                        <colgroup>
                            <col style={{ width: 20 + '%' }} />
                        </colgroup>
                        <tbody />
                    </table>
                );
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
                                            <li className="BWPQWAD-n-f">
                                                <NavLink
                                                    to={`/AccountNetwork`}
                                                    onClick={e =>
                                                        e.preventDefault()
                                                    }
                                                >
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
                                            <li>
                                                <NavLink
                                                    to={`/NetworkSettings`}
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
                                                {addbutton}
                                                {table}
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
        return <this.MapServers />;
    }
}

export default AccountNetwork;
