import React, { Component } from 'react';
import Config from '../Utils/Config';
import { reportStore, serverStore, AddReportDB } from '../App';

class AddReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: null,
            description: null,
            inputSet: false
        };
        this.RenderContent = this.RenderContent.bind(this);
        this.Handler = this.Handler.bind(this);
        this.TitleChange = this.TitleChange.bind(this);
        this.DescriptionChange = this.DescriptionChange.bind(this);
    }

    componentWillMount() {
        let th = this;
        if (serverStore.getState().length <= 0) {
            serverStore.getServerData(data => {
                th.setState(prev => {
                    return (th.state = prev);
                });
            });
        }
        if (reportStore.getState().length <= 0) {
            reportStore.getAccountReports(function (data) {
                th.setState(prev => {
                    return (th.state = prev);
                });
            });
        }
    }

    Handler(e) {
        const th = this;
        let data = [];
        data.user_id = Config.user_id;
        data.title = th.state.title.trim();
        data.description = th.state.description;

        AddReportDB(data, () => {
            th.props.history.push('/AccountReports');
        });
    }

    TitleChange(e) {
        this.setState({
            inputSet: true,
            title: e.target.value
        });
    }

    DescriptionChange(e) {
        this.setState({
            inputSet: true,
            description: e.target.value
        });
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
                    onClick={this.Handler}
                >
                    <div className="BWPQWAD-f-m">Zapisz</div>
                </button>
            );
        }

        return (
            <div className="BWPQWAD-Eh-a">
                <header className="BWPQWAD-m-i BWPQWAD-m-d BWPQWAD-k-s">
                    <h2 className="BWPQWAD-m-j BWPQWAD-m-c BWPQWAD-de-g">
                        Dodawanie Serwera
                    </h2>
                    <div>{save_button}</div>
                </header>
                <div className="BWPQWAD-Gl-b">
                    <section>
                        <fieldset className="BWPQWAD-j-f">
                            <label>
                                <div>
                                    <p className="BWPQWAD-j-i"> Nazwa </p>
                                </div>
                                <div>
                                    <div>
                                        <div className="BWPQWAD-Am-a">
                                            <input
                                                className="gwt-TextBox BWPQWAD-Am-d"
                                                onChange={this.TitleChange}
                                                dir="ltr"
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        Temat zgłoszenia.
                                    </p>
                                </div>
                            </label>

                            <label>
                                <div>
                                    <p className="BWPQWAD-j-i"> Treść </p>
                                </div>
                                <div>
                                    <div>
                                        <div className="BWPQWAD-Am-a">
                                            <textarea
                                                rows="10"
                                                className="BWPQWAD-Am-d"
                                                onChange={
                                                    this.DescriptionChange
                                                }
                                                dir="ltr"
                                            />
                                        </div>
                                    </div>
                                    <p className="BWPQWAD-j-h">
                                        Treść zgłoszenia.
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

export default AddReport;
