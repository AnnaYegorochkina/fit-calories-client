import React, {useEffect, useState, useCallback, useContext, useRef} from 'react';

import {useDispatch, useSelector} from 'react-redux';

import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';

import NumberFormat from 'react-number-format';
import moment from 'moment';
import {push} from 'connected-react-router';

import {NotificationContext} from '../../../common/AppContext';
import {getObjectByPath} from '../../../Utils';
import {produceDispatcherMainPageActions} from '../../../redux/actions/fitCalories/mainPage'

const useStyles = makeStyles(() => ({
    body: {
        backgroundColor: '#5cdb94',
    },
    section: {
        flex: 1,
        padding: 20,
        height: '100%',
        backgroundColor: '#05396b',
        color: '#fff'
    },
    formControl: {
        minWidth: 250,
    },
    menu: {
        backgroundColor: '#8de4af',
    },
    headers: {
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        textTransform: 'none',
    },
    dialog: {
        backgroundColor: '#8de4af',
    },
    progress: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1,
    },
}));

function useComponentActions(dispatch) {
    const [actions] = useState(useCallback(() => produceDispatcherMainPageActions(dispatch), []));

    return actions;
}

function NumberFormatCustom(props) {
    const {inputRef, onChange, ...other} = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator={' '}
            isNumericString={true}
            allowNegative={false}
            allowLeadingZeros={false}
            decimalScale={0}
        />
    );
}

function FitCaloriesMainPage(props) {
    const {history} = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    const {fetching, plans, selectedPlan} = useSelector(state => getObjectByPath(['fitCalories', 'mainPage'], state.reducers));

    const [planId, setPlanId] = useState('');
    const [addDialogOpened, setAddDialogOpened] = useState(false);
    const [newPlanNutritionalValue, setNewPlanNutritionalValue] = useState('');

    const newPlanNutritionalValueRef = useRef(null);

    const notification = useContext(NotificationContext);

    const {
        setFetching,
        setPlans,
        setSelectedPlan,
    } = useComponentActions(dispatch);

    const handleChangePlan = (event) => {
        setPlanId(event.target.value);
    };

    useEffect(() => {
        loadPlans();
    }, []);

    function loadPlans() {
        setFetching(true);

        fetch('http://localhost:3001/plans', {method: 'GET'})
            .then(response => response.json())
            .then(response => {
                setPlans(response);
            })
            .catch(error => {
                console.info(error);
                notification.showSnackBarError('Произошла ошибка');
            })
            .finally(() => {
                setFetching(false);
            })
    }

    function focusNewPlanNutritionalValueField() {
        if (!!newPlanNutritionalValueRef && !!newPlanNutritionalValueRef.current) {
            newPlanNutritionalValueRef.current['focus']();
        }
    }

    const handleNewPlanAddClick = () => {
        setAddDialogOpened(true);
    };

    const handleCancelAdd = () => {
        setAddDialogOpened(false);
    };

    const handleSubmitAdd = () => {
        if (newPlanNutritionalValue.length < 4) {
            notification.showSnackBar('Указана слишком маленькая калорийность', 'warning', 5);
            focusNewPlanNutritionalValueField();
            return;
        }

        setFetching(true);

        const today = moment(new Date()).format('DD/MM/YYYY');

        fetch('http://localhost:3001/plans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                name: newPlanNutritionalValue,
                fullPlanNutritionalValue: newPlanNutritionalValue,
                records: [
                    {date: today}
                ]
            })
        })
            .then(response => response.json())
            .then(response => {
                setSelectedPlan(response);
                dispatch(push({
                    pathname: `/fitCalories/planView/${response['_id']}`,
                    state: {prevLocation: !!history ? history.location : {}}
                }))
            })
            .catch(error => {
                console.info(error);
                notification.showSnackBarError('Произошла ошибка');
            })
            .finally(() => {
                setFetching(false);
            })
    };

    const handleNewPlanNutritionalValueChange = (event) => {
        setNewPlanNutritionalValue(event.target.value);
    };

    const handleLoadExistingPlan = () => {
        dispatch(push({
            pathname: `/fitCalories/planView/${planId}`,
            state: {prevLocation: !!history ? history.location : {}}
        }))
    };

    const handleDeleteExistingPlan = () => {
        setFetching(true);

        fetch(`http://localhost:3001/plans/${planId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(response => {
                setPlanId('');
                setPlans(response);
            })
            .catch(error => {
                console.info(error);
                notification.showSnackBarError('Произошла ошибка');
            })
            .finally(() => {
                setFetching(false);
            })
    };

    return <div className={classes.body} style={{height: '100%'}}>
        {fetching && <LinearProgress color={'primary'} className={classes.progress} />}
        <div style={{display: 'flex', height: '100%'}}>
            {plans.length !== 0 &&
            <div className={classes.section} style={{backgroundColor: '#5cdb94', color: '#05396b'}}>
                <Typography variant={'h3'} className={classes.headers}>Выберите существующий план</Typography>
                <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
                    <FormControl variant={'outlined'} className={classes.formControl}>
                        <InputLabel id={'plan-label'} style={{color: '#05396b'}}>План питания</InputLabel>
                        <Select
                            labelId={'plan-label'}
                            id={'plan-select'}
                            value={planId}
                            onChange={handleChangePlan}
                            label={'План питания'}
                            disabled={fetching}
                            style={{
                                //backgroundColor: '#389583',
                                color: '#05396b',
                            }}
                            MenuProps={{
                                classes: {paper: classes.menu}
                            }}
                        >
                            {plans.map((plan, index) => {
                                return <MenuItem key={`planMenuItem${index}`}
                                                 value={plan[`_id`]}>{`${plan['name']} ккал`}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    {planId !== '' &&
                    <React.Fragment>
                        <Button
                            variant={'contained'}
                            color={'primary'}
                            onClick={handleLoadExistingPlan}
                            style={{marginLeft: 10, marginTop: 10}}
                            classes={{root: classes.button}}>
                            Продолжить
                        </Button>
                        <Button
                            variant={'contained'}
                            color={'primary'}
                            onClick={handleDeleteExistingPlan}
                            style={{marginLeft: 10, marginTop: 10}}
                            classes={{root: classes.button}}>
                            Удалить выбранный план
                        </Button>
                    </React.Fragment>}
                </div>
            </div>}
            <div className={classes.section}>
                <Typography variant={'h3'} className={classes.headers}>Создайте новый план</Typography>
                <div style={{textAlign: 'center'}}>
                    <Fab color={'secondary'} aria-label={'Add new plan'} onClick={handleNewPlanAddClick}>
                        <AddIcon/>
                    </Fab>
                </div>
            </div>
        </div>

        <Dialog
            TransitionProps={{
                onEntered: focusNewPlanNutritionalValueField
            }}
            aria-labelledby={'add-plan-dialog-title'}
            open={addDialogOpened}
            fullWidth={true}
            classes={{
                paper: classes.dialog,
            }}
        >
            <DialogTitle id={'add-plan-dialog-title'}>Создание нового плана</DialogTitle>
            <DialogContent dividers>
                <TextField
                    inputRef={newPlanNutritionalValueRef}
                    id={'new-plan-nutritional-value'}
                    label={'Укажите калорийность плана (ккал)'}
                    value={newPlanNutritionalValue}
                    variant={'outlined'}
                    fullWidth={true}
                    onChange={handleNewPlanNutritionalValueChange}
                    InputProps={{
                        inputComponent: NumberFormatCustom,
                    }}
                    inputProps={{
                        maxLength: 4,
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button color={'primary'} onClick={handleCancelAdd}>
                    Отмена
                </Button>
                <Button autoFocus onClick={handleSubmitAdd} color={'primary'} variant={'contained'}>
                    Ок
                </Button>
            </DialogActions>
        </Dialog>
    </div>
}

export default FitCaloriesMainPage;