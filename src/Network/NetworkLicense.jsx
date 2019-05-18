import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Config from '../Utils/Config';
import { serverStore, GenerateDotpay, LogToDatabase } from '../App';
import axios from 'axios';
import qs from 'qs';

class NetworkLicense extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            price: 0,
            days: 0,
            discount: 0,
            valid: false,
            payForm: null,
            balance: 0.0
        };
        this.MapServers = this.MapServers.bind(this);
        this.DaysChange = this.DaysChange.bind(this);
        this.GeneratePayment = this.GeneratePayment.bind(this);
        this.ActiveTrial = this.ActiveTrial.bind(this);
    }

    componentWillMount() {
        if (serverStore.getState().length <= 0) {
            let th = this;
            serverStore.getServerData(function (data) {
                th.setState(prev => {
                    return (th.state = prev);
                });
            });
        }
    }

    DaysChange(e) {
        let days = parseInt(e.target.value, 10);
        if (days) {
            if (days <= 0) {
                e.target.value = 1;
                days = 1;
            } else if (days > 365) {
                e.target.value = 365;
                days = 365;
            }
            let total = (0.5 * days).toFixed(2);
            let discount = 0;
            for (let i = 31; i <= days; i++) {
                if (i % 30 === 0) {
                    discount += 4;
                }
                if (discount >= 32) {
                    discount = 32;
                    break;
                }
            }
            let price = parseFloat(total - total * discount / 100).toFixed(2);
            this.setState(
                {
                    total: total,
                    price: price,
                    days: days,
                    discount: discount,
                    valid: true,
                    payForm: null
                },
                this.GeneratePayment
            );
        } else {
            this.setState({
                total: 0,
                price: 0,
                days: 0,
                discount: 0,
                valid: false,
                payForm: null
            });
        }
    }

    GeneratePayment() {
        let th = this;
        GenerateDotpay({ price: th.state.price, days: th.state.days }, function (
            response,
            error
        ) {
            if (!error) {
                const form = (
                    <form
                        action="https://ssl.dotpay.pl/t2/"
                        method="POST"
                        id="dotpay_redirection_form"
                    >
                        <input name="api_version" value="dev" type="hidden" />
                        <input
                            name="amount"
                            value={th.state.price}
                            type="hidden"
                        />
                        <input name="currency" value="PLN" type="hidden" />
                        <input
                            name="description"
                            value={response.data.desc}
                            type="hidden"
                        />
                        <input
                            name="url"
                            value="https://sklepsms.pl/#/UserLicense"
                            type="hidden"
                        />
                        <input name="type" value="2" type="hidden" />
                        <input
                            name="buttontext"
                            value="Wróc do SklepSMS"
                            type="hidden"
                        />
                        <input
                            name="urlc"
                            value="https://sklepsms.pl/dotpay_callback.php"
                            type="hidden"
                        />
                        <input
                            name="control"
                            value={response.data.control}
                            type="hidden"
                        />
                        <input name="country" value="POL" type="hidden" />
                        <input name="lang" value="pl" type="hidden" />
                        <input
                            name="id"
                            value={response.data.id}
                            type="hidden"
                        />
                        <input
                            name="chk"
                            value={response.data.chk}
                            type="hidden"
                        />
                    </form>
                );
                th.setState({
                    payForm: form
                });
            } else console.log(error);
        });
    }

    ActiveTrial(e) {
        e.preventDefault();
        let th = this;
        axios
            .post(
                Config.urls.activeTrial,
                qs.stringify({
                    net_id: Config.network.net_id
                })
            )
            .then(response => {
                LogToDatabase('Active trial ' + Config.network.net_id);
                serverStore.getServerData(function (data) {
                    th.setState(prev => {
                        return (th.state = prev);
                    });
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    MapServers = function (props) {
        if (!Config.network.web_page) {
            return (
                <div className="BWPQWAD-N-a">
                    <header className="BWPQWAD-m-i BWPQWAD-m-d BWPQWAD-k-s">
                        <h2 className="BWPQWAD-m-j BWPQWAD-m-c BWPQWAD-de-g">
                            Status Licencji
                        </h2>
                        <div />
                    </header>
                    <div className="BWPQWAD-k-K">
                        <div className="BWPQWAD-S-C">
                            <div className="BWPQWAD-S-d">
                                Brak przypisanej sieci.
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        let license, options, button, price, trial;
        if (Config.network.license) {
            options = (
                <div>
                    <div className="BWPQWAD-k-s BWPQWAD-m-l BWPQWAD-Tg-D">
                        Przedłuż licencję!
                    </div>
                    Licząc od 30, każde kolejne 30 dni to{' '}
                    <span style={{ fontWeight: 'bold' }}>-4%</span> (max -32%)
                    ceny!<br />
                    <input
                        type="text"
                        className="gwt-TextBox BWPQWAD-Am-d"
                        placeholder="Ilość dni"
                        onChange={this.DaysChange}
                    />
                    <br />
                </div>
            );
            if (this.state.total > 0) {
                price = (
                    <div>
                        Cena: {this.state.total} (-{this.state.discount}%)<br />
                        Kwota końcowa: {this.state.price} zł
                    </div>
                );
            } else {
                price = null;
            }
            license = (
                <div className="panel panel-success">
                    <div className="panel-heading">Posiadasz licencje!</div>
                    <div className="panel-body">
                        Licencja ważna do{' '}
                        <span style={{ fontWeight: 'bold' }}>
                            {Config.network.license_expire}
                        </span>.<br />
                        Ostatnia płatność{' '}
                        <span style={{ fontWeight: 'bold' }}>
                            {Config.network.license_update}
                        </span>.<br />
                        <br />
                        {options}
                        {price}
                        {this.state.payForm}
                    </div>
                </div>
            );
        } else {
            options = (
                <div>
                    <div className="BWPQWAD-k-s BWPQWAD-m-l BWPQWAD-Tg-D">
                        Zakup licencje by w pełni korzystać z usług sklepu!
                    </div>
                    Licząc od 30, każde kolejne 30 dni to{' '}
                    <span style={{ fontWeight: 'bold' }}>-4%</span> (max -32%)
                    ceny!<br />
                    <input
                        type="text"
                        className="gwt-TextBox BWPQWAD-Am-d"
                        placeholder="Ilość dni"
                        onChange={this.DaysChange}
                    />
                    <br />
                </div>
            );
            if (this.state.total > 0) {
                price = (
                    <div>
                        Cena: {this.state.total} (-{this.state.discount}%)<br />
                        Kwota końcowa: {this.state.price} zł
                    </div>
                );
            } else {
                price = null;
            }
            license = (
                <div className="panel panel-danger">
                    <div className="panel-heading">Brak licencji!</div>
                    <div className="panel-body">
                        {options}
                        {price}
                        {this.state.payForm}
                    </div>
                </div>
            );
        }

        if (Config.network.trial) {
            trial = null;
        } else {
            trial = (
                <NavLink
                    to={'/#'}
                    className="BWPQWAD-Tg-y BWPQWAD-k-s"
                    onClick={this.ActiveTrial}
                >
                    <span className="BWPQWAD-Tg-x">
                        <span>Wypróbuj sklep przez 3 dni za darmo!</span>
                    </span>
                </NavLink>
            );
        }

        if (this.state.payForm !== null) {
            button = (
                <button
                    id="dotpay_redirection_button"
                    type="submit"
                    form="dotpay_redirection_form"
                    value="Submit"
                    className="BWPQWAD-f-a BWPQWAD-de-a BWPQWAD-f-r"
                >
                    <div className="BWPQWAD-f-m">
                        <i className="fa fa-shopping-cart BWPQWAD-l-cb" />
                        <span className="BWPQWAD-k-u">Zapłać</span>
                    </div>
                </button>
            );
        } else {
            button = (
                <button
                    className="BWPQWAD-f-a BWPQWAD-de-a BWPQWAD-f-r BWPQWAD-f-f"
                    disabled
                >
                    <div className="BWPQWAD-f-m">
                        <i className="fa fa-shopping-cart BWPQWAD-l-cb" />
                        <span className="BWPQWAD-k-u">Zapłać</span>
                    </div>
                </button>
            );
        }

        return (
            <div className="BWPQWAD-N-a">
                <header className="BWPQWAD-m-i BWPQWAD-m-d BWPQWAD-k-s">
                    <h2 className="BWPQWAD-m-j BWPQWAD-m-c BWPQWAD-de-g">
                        Status Licencji
                    </h2>
                    {trial}
                    <div>{button}</div>
                </header>
                <div className="BWPQWAD-k-K">{license}</div>
            </div>
        );
    };

    render() {
        return <this.MapServers />;
    }
}

export default NetworkLicense;
