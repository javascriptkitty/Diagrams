import React, { useEffect } from 'react';
import { DiagramInfo } from '../../models';
import { mxgraph } from 'mxgraph';
import DataService from '../../services/data.service';
import { FormControl, MenuItem, Select } from '@material-ui/core';

interface RestrictionTypesProps {
    diagramInfo: DiagramInfo;
    restriction: {};
    element: mxgraph.mxCell;
}

export default function DiagramRelationRestrictionEditor(props: RestrictionTypesProps) {
    const [state, setState] = React.useState([]);

    const { diagramInfo, restriction } = props;
    const isClassifier = diagramInfo.type === 'INDICATOR' ? false : true;

    useEffect(() => {
        DataService.getOntologyRelations().then(res => {
            setState(res);
            //error
        });
    });

    const [selected, setSelected] = React.useState('');

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelected(event.target.value as string);
    };

    return (
        <div>
            {restriction === 'relation' ? (
                <div className="entityRestrictions">
                    <h3>Тип связи</h3>
                    <FormControl variant="outlined">
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={selected}
                            onChange={handleChange}
                        >
                            {state.map((type, index) => {
                                return (
                                    <MenuItem value={type.uri} key={index}>
                                        {type.label}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </div>
            ) : (
                <div>
                    {!isClassifier ? (
                        <div className="classifier">
                            <h3>Классификатор сущности</h3>
                            <FormControl variant="outlined">
                                <Select></Select>{' '}
                            </FormControl>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
