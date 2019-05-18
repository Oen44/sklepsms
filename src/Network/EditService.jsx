import React, { Component } from 'react';
import { serverStore, serviceStore, LogToDatabase } from '../App';
import Config from '../Utils/Config';
import axios from 'axios';
import qs from 'qs';

class EditService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputSet: false,
            services: []
        };
        this.RenderContent = this.RenderContent.bind(this);
        this.SendEdit = this.SendEdit.bind(this);
        this.IndexChange = this.IndexChange.bind(this);
        this.TitleChange = this.TitleChange.bind(this);
        this.DescChange = this.DescChange.bind(this);
        this.SuffixChange = this.SuffixChange.bind(this);
        this.TypeChange = this.TypeChange.bind(this);
        this.LoadService = this.LoadService.bind(this);
    }

    componentWillMount() {
        let th = this;
        if (serverStore.getState().length <= 0) {
            serverStore.getServerData(data => {
                serviceStore.getNetworkServices(data => {
                    th.setState(
                        {
                            services: data
                        },
                        th.LoadService
                    );
                });
            });
        } else {
            serviceStore.getNetworkServices(data => {
                th.setState(
                    {
                        services: data
                    },
                    th.LoadService
                );
            });
        }
    }

    LoadService() {
        const id = this.props.match.params.id;
        const services = this.state.services;
        let service;
        for (let s in services) {
            if (services[s].id === id) {
                service = services[s];
                break;
            }
        }
        this.setState({
            service: service
        });
    }

    IndexChange(e) {
        this.setState({
            inputSet: true,
            s_id: e.target.value.trim()
        });
    }

    TitleChange(e) {
        this.setState({
            inputSet: true,
            s_title: e.target.value.trim()
        });
    }

    DescChange(e) {
        this.setState({
            inputSet: true,
            s_desc: e.target.value.trim()
        });
    }

    SuffixChange(e) {
        this.setState({
            inputSet: true,
            s_suffix: e.target.value.trim()
        });
    }

    TypeChange(e) {
        this.setState({
            inputSet: true,
            s_type: e.target.value
        });
    }

    APIChange(e) {
        this.setState({
            inputSet: true,
            s_type: e.target.value
        });
    }

    SendEdit() {
        const th = this;
        const id = this.props.match.params.id;
        const s_id = this.state.s_id || this.state.service.service_id;
        const s_title = this.state.s_title || this.state.service.service_title;
        const s_desc =
            this.state.s_desc || this.state.service.service_description;
        const s_suffix =
            this.state.s_suffix || this.state.service.service_suffix;
        const s_type = this.state.s_type || this.state.service.service_type;

        axios
            .post(
                Config.urls.editService,
                qs.stringify({
                    id: id,
                    s_id: s_id,
                    s_title: s_title,
                    s_desc: s_desc,
                    s_suffix: s_suffix,
                    s_type: s_type
                })
            )
            .then(response => {
                LogToDatabase('Edit service ' + s_id);
                th.props.history.push('/NetworkServices');
            })
            .catch(error => {
                console.log(error);
            });
    }

    RenderContent(props) {
        const service = this.state.service;

        if (!service) {
            return (
                <div className="BFPMQ6-Z-a" data-hidden="false">
                    <div className="BFPMQ6-k-Q BFPMQ6-k-t">
                        <span className="BFPMQ6-l-K BFPMQ6-Z-b" />
                    </div>
                </div>
            );
        }

        let save_button;

        if (!this.state.inputSet) {
            save_button = (
                <button
                    className="BWPQWAD-f-a BWPQWAD-f-g BWPQWAD-f-r BWPQWAD-f-f"
                    disabled
                >
                    <div className="BWPQWAD-f-m">Zapisz</div>
                </button>
            );
        } else {
            save_button = (
                <button
                    className="BWPQWAD-f-a BWPQWAD-f-g BWPQWAD-f-r"
                    onClick={this.SendEdit}
                >
                    <div className="BWPQWAD-f-m">Zapisz</div>
                </button>
            );
        }

        return (
            <div className="BWPQWAD-Eh-a">
                <header className="BWPQWAD-m-i BWPQWAD-m-d BWPQWAD-k-s">
                    <h2 className="BWPQWAD-m-j BWPQWAD-m-c BWPQWAD-de-g">
                        Edycja Usługi
                    </h2>
                    <div>{save_button}</div>
                </header>
                <div className="BWPQWAD-Gl-b">
                    <section>
                        <fieldset className="BWPQWAD-j-f">
                            <label>
                                <div>
                                    <p className="BWPQWAD-j-i"> ID Usługi </p>
                                </div>
                                <div>
                                    <div>
                                        <div className="BWPQWAD-Am-a">
                                            <input
                                                className="gwt-TextBox BWPQWAD-Am-d"
                                                dir="ltr"
                                                type="text"
                                                maxLength="16"
                                                defaultValue={
                                                    service.service_id
                                                }
                                                onChange={this.IndexChange}
                                            />
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        Unikalne ID usługi potrzebne do
                                        rozpoznania pluginu na serwerze (max 16
                                        znaków).
                                    </p>
                                </div>
                            </label>

                            <label>
                                <div>
                                    <p className="BWPQWAD-j-i"> Tytuł </p>
                                </div>
                                <div>
                                    <div>
                                        <div className="BWPQWAD-Am-a">
                                            <input
                                                className="gwt-TextBox BWPQWAD-Am-d"
                                                dir="ltr"
                                                type="text"
                                                defaultValue={
                                                    service.service_title
                                                }
                                                onChange={this.TitleChange}
                                            />
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        Tytuł usługi w menu /sklepsms (max 32
                                        znaków).
                                    </p>
                                </div>
                            </label>

                            <label>
                                <div>
                                    <p className="BWPQWAD-j-i"> Opis </p>
                                </div>
                                <div>
                                    <div>
                                        <div className="BWPQWAD-Am-a">
                                            <input
                                                className="gwt-TextBox BWPQWAD-Am-d"
                                                dir="ltr"
                                                type="text"
                                                defaultValue={
                                                    service.service_description
                                                }
                                                onChange={this.DescChange}
                                            />
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        Opis usługi, dostępny po wybraniu usługi
                                        w menu /sklepsms (max 32 znaków).
                                    </p>
                                </div>
                            </label>

                            <label>
                                <div>
                                    <p className="BWPQWAD-j-i"> Suffix </p>
                                </div>
                                <div>
                                    <div>
                                        <div className="BWPQWAD-Am-a">
                                            <input
                                                className="gwt-TextBox BWPQWAD-Am-d"
                                                dir="ltr"
                                                type="text"
                                                defaultValue={
                                                    service.service_suffix
                                                }
                                                onChange={this.SuffixChange}
                                            />
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        Dopisek do menu z ilościami (np. suffix{' '}
                                        <strong>dni</strong> = 7{' '}
                                        <strong>dni</strong>, 14{' '}
                                        <strong>dni</strong>, 30{' '}
                                        <strong>dni</strong> itd).{' '}
                                    </p>
                                </div>
                            </label>

                            <label>
                                <div>
                                    <p className="BWPQWAD-j-i"> Typ </p>
                                </div>
                                <div>
                                    <div>
                                        <div className="BWPQWAD-Am-a">
                                            <select
                                                className="gwt-TextBox gwt-Price BWPQWAD-In-a"
                                                onChange={this.TypeChange}
                                                defaultValue={
                                                    service.service_type
                                                }
                                            >
                                                <option value="0">Flagi</option>
                                                <option value="1">Inna</option>
                                                <option value="2">Skiny</option>
                                            </select>
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        Usługa dodająca flagi, własne natywy
                                        (Inna) lub skiny
                                    </p>
                                </div>
                            </label>
                        </fieldset>
                    </section>
                </div>
            </div>
        );
    }

    render() {
        return <this.RenderContent />;
    }
}

export default EditService;
