import React, { useEffect } from 'react';
import { DiagramInfo } from '../../models';
import { mxgraph } from 'mxgraph';
import { FormControl, MenuItem, Select } from '@material-ui/core';
import DataService from '../../services/data.service';

interface RestrictionTypesProps {
    diagramInfo: DiagramInfo;

    element: mxgraph.mxCell;
}

let ontologyPromise;
export default function DiagramEntityRestrictionEditor(props: RestrictionTypesProps) {
    const [state, setState] = React.useState([]);

    const { diagramInfo } = props;
    const isClassifier = diagramInfo.type === 'INDICATOR' ? false : true;

    useEffect(() => {
        if (ontologyPromise == null) {
            ontologyPromise = DataService.getOntologyEntities().then(res => {
                setState(res);
            });
        }
    });

    const [selected, setSelected] = React.useState('');

    const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
        setSelected(event.target.value);
    };

    return (
        <div className="entityRestrictions">
            <h3>Тип сущности</h3>
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
            {!isClassifier ? (
                <div className="classifier">
                    <h3>Классификатор сущности</h3>
                    <FormControl variant="outlined">
                        <Select></Select>{' '}
                    </FormControl>
                </div>
            ) : null}
        </div>
    );
}
