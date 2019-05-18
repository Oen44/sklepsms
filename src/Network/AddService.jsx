import React, { Component } from 'react';
import { serverStore, LogToDatabase } from '../App';
import Config from '../Utils/Config';
import axios from 'axios';
import qs from 'qs';

class AddService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputSet: false,
            s_type: 0
        };
        this.RenderContent = this.RenderContent.bind(this);
        this.SendAdd = this.SendAdd.bind(this);
        this.IndexChange = this.IndexChange.bind(this);
        this.TitleChange = this.TitleChange.bind(this);
        this.DescChange = this.DescChange.bind(this);
        this.SuffixChange = this.SuffixChange.bind(this);
        this.TypeChange = this.TypeChange.bind(this);
        this.GetIndexes = this.GetIndexes.bind(this);
        this.ServiceIndexExists = this.ServiceIndexExists.bind(this);
    }

    componentWillMount() {
        let th = this;
        if (serverStore.getState().length <= 0) {
            serverStore.getServerData(function (data) {
                th.setState(prev => {
                    return (th.state = prev);
                }, th.GetIndexes());
            });
        } else this.GetIndexes();
    }

    GetIndexes() {
        let th = this;
        axios
            .post(Config.urls.getServiceIndexes)
            .then(response => {
                th.setState({
                    indexes: response.data
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    IndexChange(e) {
        const id = e.target.value.trim();
        this.ServiceIndexExists(id);
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
            s_type: e.target.value
        });
    }

    ServiceIndexExists(value) {
        let check = this.state.indexes.includes(value);
        if (check) {
            this.setState({
                inputSet: false,
                errorIndex:
                    'Podane Id jest już zajęte. Proponuje <strong>' +
                    Config.user_id +
                    '-' +
                    value +
                    '</strong>'
            });
        } else {
            this.setState({
                inputSet: true,
                errorIndex: null,
                s_id: value
            });
        }
    }

    SendAdd() {
        const th = this;
        const net_id = Config.network.net_id;
        const s_id = this.state.s_id;
        const s_title = this.state.s_title;
        const s_desc = this.state.s_desc;
        const s_suffix = this.state.s_suffix;
        const s_type = this.state.s_type;

        let error = false;

        this.ServiceIndexExists();

        if (!s_id || s_id.length < 1) {
            this.setState({ errorIndex: 'To pole nie może być puste' });
            error = true;
        } else if (s_id.length > 13) {
            this.setState({
                errorIndex: 'Przekroczono maksymalną ilość znaków'
            });
            error = true;
        } else if (this.ServiceIndexExists()) {
            this.setState({
                errorIndex:
                    'Podane Id jest już zajęte. Proponuje <strong>' +
                    Config.user_id +
                    '-' +
                    s_id +
                    '</strong>'
            });
            error = true;
        } else this.setState({ errorIndex: null });

        if (!s_title || s_title.length < 1) {
            this.setState({ errorTitle: 'To pole nie może być puste' });
            error = true;
        } else if (s_title.length > 32) {
            this.setState({
                errorTitle: 'Przekroczono maksymalną ilość znaków'
            });
            error = true;
        } else this.setState({ errorTitle: null });

        if (!s_desc || s_desc.length < 1) {
            this.setState({ errorDesc: 'To pole nie może być puste' });
            error = true;
        } else if (s_desc.length > 32) {
            this.setState({
                errorDesc: 'Przekroczono maksymalną ilość znaków'
            });
            error = true;
        } else this.setState({ errorDesc: null });

        if (!s_suffix || s_suffix.length < 1) {
            this.setState({ errorSuffix: 'To pole nie może być puste' });
            error = true;
        } else if (s_suffix.length > 13) {
            this.setState({
                errorSuffix: 'Przekroczono maksymalną ilość znaków'
            });
            error = true;
        } else this.setState({ errorSuffix: null });

        if (!error) {
            axios
                .post(
                    Config.urls.addService,
                    qs.stringify({
                        net_id: net_id,
                        s_id: s_id,
                        s_title: s_title,
                        s_desc: s_desc,
                        s_suffix: s_suffix,
                        s_type: s_type
                    })
                )
                .then(response => {
                    LogToDatabase('Add service ' + s_id + ' ' + s_title);
                    th.props.history.push('/NetworkServices');
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    RenderContent(props) {
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
                    onClick={this.SendAdd}
                >
                    <div className="BWPQWAD-f-m">Zapisz</div>
                </button>
            );
        }

        let errorIndex, errorTitle, errorDesc, errorSuffix;

        if (this.state.errorIndex) {
            errorIndex = (
                <div
                    className="alert alert-danger"
                    dangerouslySetInnerHTML={{ __html: this.state.errorIndex }}
                />
            );
        }
        if (this.state.errorTitle) {
            errorTitle = (
                <div className="alert alert-danger">
                    {this.state.errorTitle}
                </div>
            );
        }
        if (this.state.errorDesc) {
            errorDesc = (
                <div className="alert alert-danger">{this.state.errorDesc}</div>
            );
        }
        if (this.state.errorSuffix) {
            errorSuffix = (
                <div className="alert alert-danger">
                    {this.state.errorSuffix}
                </div>
            );
        }

        return (
            <div className="BWPQWAD-Eh-a">
                <header className="BWPQWAD-m-i BWPQWAD-m-d BWPQWAD-k-s">
                    <h2 className="BWPQWAD-m-j BWPQWAD-m-c BWPQWAD-de-g">
                        Dodawanie Usługi
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
                                                onChange={this.IndexChange}
                                            />
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        Unikalne ID usługi potrzebne do
                                        rozpoznania pluginu na serwerze (max 16
                                        znaków).
                                    </p>
                                    {errorIndex}
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
                                                onChange={this.TitleChange}
                                            />
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        Tytuł usługi w menu /sklepsms (max 32
                                        znaków).
                                    </p>
                                    {errorTitle}
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
                                                onChange={this.DescChange}
                                            />
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        Opis usługi, dostępny po wybraniu usługi
                                        w menu /sklepsms (max 32 znaków).
                                    </p>
                                    {errorDesc}
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
                                                onChange={this.SuffixChange}
                                            />
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        Dopisek do menu z ilościami - np. suffix{' '}
                                        <strong>dni</strong> = 7{' '}
                                        <strong>dni</strong>, 14{' '}
                                        <strong>dni</strong>, 30{' '}
                                        <strong>dni</strong> itd. (max 13
                                        znaków).
                                    </p>
                                    {errorSuffix}
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

export default AddService;
