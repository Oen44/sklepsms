import React, { Component } from 'react';
import Config from './Config';
import axios from 'axios';
import qs from 'qs';
import $ from 'jquery';

class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updates: []
        };
        this.SendNews = this.SendNews.bind(this);
    }

    componentWillMount() {
        let th = this;
        axios
            .post(Config.urls.getUpdates)
            .then(response => {
                th.setState({
                    updates: response.data
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    componentDidMount() {
        $('#sendNews').off('click');
        $('#sendNews').on('click', () => {
            this.SendNews(
                $('#newsVersion').val(),
                $('#newsContent').val()
            );
        });
    }

    SendNews(version, text) {
        axios
            .post(
                Config.urls.sendNews,
                qs.stringify({ version: version, text: text })
            )
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        let updates = this.state.updates;
        let updateList, add_news;
        if (updates.length < 1) {
            updateList = (
                <div className="BWPQWAD-S-C">
                    <div className="BWPQWAD-S-d">Brak aktualizacji.</div>
                </div>
            );
        } else {
            updateList = updates.map(update => (
                <div className="panel panel-info" key={update.id}>
                    <div className="panel-heading">
                        Wersja: {update.version} - {update.date}
                    </div>
                    <div className="panel-body" dangerouslySetInnerHTML={{__html: update.text}}></div>
                </div>
            ));
        }
        if (Config.user_id === 1) {
            add_news = (
                <button
                    className="BWPQWAD-f-a BWPQWAD-de-a BWPQWAD-f-r"
                    style={{ cursor: 'pointer' }}
                    data-toggle="modal"
                    data-target="#addNews"
                >
                    <div className="BWPQWAD-f-m">
                        <i className="fa fa-plus BWPQWAD-l-cb" />
                        <span className="BWPQWAD-k-u"> Dodaj </span>
                    </div>
                </button>
            );
        }
        return (
            <div className="BWPQWAD-Eh-a">
                <header className="BWPQWAD-m-i BWPQWAD-m-d BWPQWAD-k-s">
                    <h2 className="BWPQWAD-m-j BWPQWAD-m-c BWPQWAD-de-g">
                        Aktualizacje
                    </h2>
                    <div>
                        {add_news}
                    </div>
                </header>
                <div className="BWPQWAD-Gl-b">
                    <section>{updateList}</section>
                </div>
            </div>
        );
    }
}

export default News;
