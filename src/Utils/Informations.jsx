import React, { Component } from 'react';
import { serverStore } from '../App';
import Config from './Config';

class Informations extends Component {
    componentWillMount() {
        if (serverStore.getState().length <= 0) {
            serverStore.getServerData();
        }
    }

    render() {
        return (
            <div className="BWPQWAD-Eh-a">
                <header className="BWPQWAD-m-i BWPQWAD-m-d BWPQWAD-k-s">
                    <h2 className="BWPQWAD-m-j BWPQWAD-m-c BWPQWAD-de-g">
                        Informacje
                    </h2>
                    <div />
                </header>
                <div className="BWPQWAD-Gl-b">
                    <section>
                        <div className="panel panel-info">
                            <div className="panel-heading">Plugin AMXX</div>
                            <div className="panel-body">
                                <strong>AMXX 1.8.2:</strong>
                                <ul>
                                    <li>
                                        {'Paczka: '}
                                        <a
                                            href={
                                                'https://sklepsms.pl/amxx/' +
                                                Config.shop.amxx.v182.pack
                                            }
                                        >
                                            {Config.shop.amxx.v182.pack}
                                        </a>
                                    </li>
                                    <li>
                                        {'Aktualizacja: '}
                                        <a
                                            href={
                                                'https://sklepsms.pl/amxx/' +
                                                Config.shop.amxx.v182.update
                                            }
                                        >
                                            {Config.shop.amxx.v182.update}
                                        </a>
                                    </li>
                                </ul>
                                <br />
                                <strong>AMXX 1.8.3:</strong>
                                <ul>
                                    <li>
                                        {'Paczka: '}
                                        <a
                                            href={
                                                'https://sklepsms.pl/amxx/' +
                                                Config.shop.amxx.v183.pack
                                            }
                                        >
                                            {Config.shop.amxx.v183.pack}
                                        </a>
                                    </li>
                                    <li>
                                        {'Aktualizacja: '}
                                        <a
                                            href={
                                                'https://sklepsms.pl/amxx/' +
                                                Config.shop.amxx.v183.update
                                            }
                                        >
                                            {Config.shop.amxx.v183.update}
                                        </a>
                                    </li>
                                </ul>
                                <br />
                                <strong>AMXX 1.9:</strong>
                                <ul>
                                    <li>
                                        {'Paczka: '}
                                        <a
                                            href={
                                                'https://sklepsms.pl/amxx/' +
                                                Config.shop.amxx.v19.pack
                                            }
                                        >
                                            {Config.shop.amxx.v19.pack}
                                        </a>
                                    </li>
                                    <li>
                                        {'Aktualizacja: '}
                                        <a
                                            href={
                                                'https://sklepsms.pl/amxx/' +
                                                Config.shop.amxx.v19.update
                                            }
                                        >
                                            {Config.shop.amxx.v19.update}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="panel panel-info">
                            <div className="panel-heading">
                                Plugin SourceMod
                            </div>
                            <div className="panel-body">
                                <strong>W trakcie tworzenia</strong>
                            </div>
                        </div>

                        <div className="panel panel-warning">
                            <div className="panel-heading">
                                Cvary (konfiguracja w sklepsms.cfg)
                            </div>
                            <div className="panel-body">
                                <p>
                                    <strong>shop_netid &lt;liczba&gt;</strong>
                                    <span>
                                        &nbsp;- Numer sieci (widoczny przy
                                        nazwie sieci w panelu)
                                    </span>
                                </p>
								<p>
                                    <strong>shop_admin &lt;liczba&gt;</strong>
                                    <span>
                                        &nbsp;- flaga wymagana do dostępu do Menu Admina
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="panel panel-success">
                            <div className="panel-heading">Licencja</div>
                            <div className="panel-body">
                                <p>
                                    Podstawą działania sklepu jest posiadanie
                                    licenji. Każda sieć może skorzystać z
                                    darmowych 3 dni do wypróbowania sklepu.
                                    Zakup licencji jest możliwy na wybraną ilość
                                    dni, zaczynając od jednego dnia. Koszt
                                    licencji to 50 groszy za dzień. Im więcej
                                    dni, tym więcej można zaoszczędzić.
                                </p>
                            </div>
                        </div>

                        <div className="panel panel-danger">
                            <div className="panel-heading">
                                Pytania, błędy, problemy
                            </div>
                            <div className="panel-body">
                                <p>
                                    Najlepszy i najszybszy kontakt z
                                    administracją SklepSMS.pl jest poprzez
                                    Raporty. Wszelkie pytania i zgłaszanie
                                    błędów prosimy kierować właśnie tam.
                                    Odpowiadamy nawet w kilka minut.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

export default Informations;
