/*
 * This file is part of Cockpit.
 *
 * Copyright (C) 2017 Red Hat, Inc.
 *
 * Cockpit is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * Cockpit is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cockpit; If not, see <http://www.gnu.org/licenses/>.
 */

import cockpit from 'cockpit';
import React from 'react';
import { Alert, Card, CardTitle, CardBody, Checkbox, DataList, DataListItem, DataListItemRow, DataListItemCells, DataListCell } from '@patternfly/react-core';
import { FanIcon, ThermometerHalfIcon, ChargingStationIcon, CpuIcon } from '@patternfly/react-icons/dist/esm/icons/';

export class Application extends React.Component {
    constructor() {
        super();
        this.state = { sensors: {}, intervalId: {}, alert: null, fahrenheitTemp: [], fahrenheitChecked: false };

        cockpit.file('/etc/hostname').watch(content => {
            this.setState({ hostname: content.trim() });
        });
    }

    componentDidMount() {
        const intervalId = setInterval(() => {
            this.loadSensors();
        }, 1000);
        this.setState({ intervalId });
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    loadSensors = () => {
        cockpit
                .spawn(["sensors", "-j"].concat(this.state.fahrenheitTemp))
                .then((sucess, erro) => {
                    this.setState({ sensors: JSON.parse(sucess) });
                })
                .catch((err) => {
                    console.log(err);
                    if (err.message === "not-found") this.setAlert('lm-sensors not found', 'danger');
                    this.setAlert(err.message, 'warning');
                    clearInterval(this.state.intervalId);
                });
    };

    setIcon = (name) => {
        if (name.includes('fan')) {
            return <FanIcon size='md' />;
        }
        if (name.includes('temp')) {
            return <ThermometerHalfIcon size='md' />;
        }
        if (name.includes('in')) {
            return <ChargingStationIcon size='md' />;
        }
        if (name.includes('cpu')) {
            return <CpuIcon size='md' />;
        }
        return <></>;
    };

    adjustLabel = (label) => {
        return label.replace(label.substring(0, label.indexOf('_')) + '_', '');
    };

    setAlert = (msg, variant) => {
        this.setState({ alert: { msg, variant } });
    };

    handleChange = (checked, event) => {
        this.setState({ fahrenheitChecked: checked });
        if (checked) {
            this.setAlert('lm-sensors has a bug that converts all data to fahrenheit, including voltage, fans and etc.', 'info');
            this.setState({ fahrenheitTemp: ['-f'] });
        } else {
            this.setState({ fahrenheitTemp: [], alert: null });
        }
    };

    render() {
        const { sensors, alert, fahrenheitChecked } = this.state;
        return (
            <Card>
                <CardTitle>Sensors</CardTitle>
                <CardBody>
                    <Checkbox
                        label="Show temperature in Fahrenheit"
                        isChecked={fahrenheitChecked}
                        onChange={this.handleChange}
                        id="fahrenheit-checkbox"
                        name="fahrenheit-checkbox"
                    />
                    {alert != null ? <Alert variant={alert.variant}>{alert.msg}</Alert> : <></>}
                    {sensors !== null
                        ? Object.entries(sensors).map((key, index) =>
                            <Card key={key}>
                                <CardTitle>{key[0]}</CardTitle>
                                <CardBody>
                                    <CardTitle>{key[1].Adapter}</CardTitle>
                                    <DataList aria-label="Compact data list example" isCompact>
                                        <DataListItem aria-labelledby="simple-item1">
                                            {
                                                Object.entries(key[1]).map((item, index) => {
                                                    if (index === 0) return null;
                                                    return (
                                                        <DataListItemRow key={item}>
                                                            <DataListItemCells
                                                                dataListCells={
                                                                    Object.entries(item[1]).map((item, index) => (
                                                                        <DataListCell key={item}>{index === 0 ? this.setIcon(item[0]) : ''} {this.adjustLabel(item[0])}: {item[1]}</DataListCell>
                                                                    ))
                                                                }
                                                            />
                                                        </DataListItemRow>
                                                    );
                                                })
                                            }
                                        </DataListItem>
                                    </DataList>
                                </CardBody>
                            </Card>
                        )
                        : ''}
                </CardBody>
            </Card>
        );
    }
}
