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
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import MoodBadIcon from '@material-ui/icons/MoodBad';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from "@material-ui/core/Tooltip";
import Chip from '@material-ui/core/Chip';
import FunctionsIcon from '@material-ui/icons/Functions';
import Avatar from '@material-ui/core/Avatar';

import {KeyboardDatePicker} from '@material-ui/pickers';

import {Scrollbars} from 'react-custom-scrollbars';
import clsx from 'clsx';

import moment from 'moment';

import {push} from 'connected-react-router';

import {BsFillEggFill} from 'react-icons/bs';
import {FaCheese, FaBreadSlice} from 'react-icons/fa';

import {NotificationContext} from '../../../common/AppContext';
import {getObjectByPath} from '../../../Utils';
import {produceDispatcherPlanViewActions} from '../../../redux/actions/fitCalories/planView'
import NutritionTableTemplate from '../NutritionTableTemplate/NutritionTableTemplate';

const drawerWidth = 240;

const useStyles = makeStyles(() => ({
    root: {
        backgroundColor: '#5cdb94',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    appBar: {
        transition: 'margin 0.2s ease, width 0.2s ease',
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: 'margin 0.225s ease, width 0.225s ease',
    },
    menuButton: {
        marginRight: 15,
        height: 64,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: '#05396b',
        color: '#fff',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: 8,
        justifyContent: 'flex-end',
    },
    content: {
        transition: 'margin 0.2s ease, width 0.2s ease',
        flexGrow: 1,
    },
    contentShift: {
        transition: 'margin 0.225s ease, width 0.225s ease',
        marginLeft: drawerWidth,
        flexGrow: 1,
    },
    menu: {
        backgroundColor: '#8de4af',
    },
    formControl: {
        minWidth: 200,
        marginLeft: 10,
        marginRight: 10,
    },
    tabs: {
        color: '#fff',
        marginLeft: 20,
        marginBottom: -15,
    },
    tabIndicator: {
        backgroundColor: '#389583',
    },
    tab: {
        textTransform: 'none',
        fontSize: 16,
    },
    fabButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#05396b',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#389583',
        }
    },
    addRecordDialog: {
        width: 300,
        backgroundColor: '#8de4af',
    },
    progress: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1,
    },
    button: {
        textTransform: 'none',
    },
    dialog: {
        backgroundColor: '#8de4af',
    },
    checkbox: {
        color: '#05396b !important',
    },
    chip: {
        backgroundColor: '#389583',
        marginRight: 10,
    },
    avatar: {
        backgroundColor: '#05396b !important'
    },
    tooltip: {
        fontSize: '14px !important',
    },
}));

function useComponentActions(dispatch) {
    const [actions] = useState(useCallback(() => produceDispatcherPlanViewActions(dispatch), []));

    return actions;
}

function PlanView(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const {planId, history} = props;

    const {fetching, planRecords, selectedPlan} = useSelector(state => getObjectByPath(['fitCalories', 'planView'], state[`reducers`]));

    const [open, setOpen] = React.useState(false);
    const [planDate, setPlanDate] = useState('');
    const [tabValue, setTabValue] = useState('breakfast');
    const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
    const [addRecordDialogOpen, setAddRecordDialogOpen] = useState(false);
    const [newProductInfo, setNewProductInfo] = useState({
        sectionName: '',
        name: '',
        nutritionalValue: '',
        protein: '',
        fat: '',
        carbohydrates: '',
        addInAllMeals: false,
    });

    const [mealsKal, setMealsKal] = useState({
        breakfast: 0,
        lunch: 0,
        dinner: 0,
    });

    const [planFetching, setPlanFetching] = useState(true);
    const [planRecordsFetching, setPlanRecordsFetching] = useState(true);

    const [nutritionSectionOpen, setNutritionSectionOpen] = useState({
        breakfast: {
            protein: true,
            fat: true,
            carbohydrates: true,
        },
        lunch: {
            protein: true,
            fat: true,
            carbohydrates: true,
        },
        dinner: {
            protein: true,
            carbohydrates: true,
        },
    });

    const [selectedRecord, setSelectedRecord] = useState({});
    const [newRecordDate, setNewRecordDate] = useState(null);

    const {
        setFetching,
        setPlanRecords,
        setSelectedPlan,
    } = useComponentActions(dispatch);

    const sectionNameInputRef = useRef(null);
    const nameInputRef = useRef(null);
    const nutritionalValueInputRef = useRef(null);

    const notification = useContext(NotificationContext);

    useEffect(() => {
        loadPlan();
        loadPlanRecords();
    }, []);

    useEffect(() => {
        if (planDate !== '' && planRecords.length !== 0) {
            const selectedRecordIn = planRecords.filter(record => record[`date`] === planDate)[0];
            if (selectedRecordIn) {
                setSelectedRecord(selectedRecordIn);
            }
        }
    }, [planDate, planRecords]);

    useEffect(() => {
        if (planFetching || planRecordsFetching) {
            setFetching(true);
        }
        if (!planFetching && !planRecordsFetching) {
            setFetching(false);
        }
    }, [planFetching, planRecordsFetching]);

    useEffect(() => {
        const mealsKalIn = {
            breakfast: 0,
            lunch: 0,
            dinner: 0,
        };

        const checkedMealsProducts = {
            breakfast: [],
            lunch: [],
            dinner: [],
        };

        const selectedRecordCopy = JSON.parse(JSON.stringify(selectedRecord));

        if (selectedRecordCopy[`records`]) {
            const selectedRecordRecordsCopy = selectedRecordCopy[`records`];

            ['breakfast', 'lunch', 'dinner'].map(meal => {
                ['protein', 'fat', 'carbohydrates'].map(sectionName => {
                    if (selectedRecordRecordsCopy[meal][sectionName]) {
                        selectedRecordRecordsCopy[meal][sectionName][`records`].map(product => {
                            if (product[`checked`] === true && product[`eaten`]) {
                                checkedMealsProducts[meal].push(product)
                            }
                        })
                    }
                })
            });

            Object.keys(checkedMealsProducts).forEach(meal => {
                mealsKalIn[meal] = checkedMealsProducts[meal].reduce((totalMealKal, product) =>
                    Math.round(totalMealKal + (product[`nutritionalValue`] * Number(product[`eaten`])) / 100), 0);
            });

            setMealsKal(mealsKalIn);
        }


        // Object.keys(selectedSection).forEach(key => {
        //     if (key.indexOf(tabValue) !== -1 && key !== sectionName) {
        //         mealSections[key] = JSON.parse(JSON.stringify(selectedSection[key]));
        //         mealSections[key].map(product => {
        //             if (product[`checked`] === true && product[`eaten`]) {
        //                 checkedMealProducts.push(product);
        //             }
        //         })
        //     }
        // });
        //
        // let sumMealNutritionalValue = checkedMealProducts.reduce((totalNutritionalValue, product) =>
        //         (totalNutritionalValue + (product[`nutritionalValue`] * Number(product[`eaten`])) / 100)
        //     , 0);
        //
        // sumMealNutritionalValue = sumMealNutritionalValue + sumNutritionalValue;
        //

    }, [selectedRecord]);

    function loadPlan() {
        setPlanFetching(true);
        fetch(`http://localhost:3001/plans/${planId}`, {method: 'GET'})
            .then(response => response.json())
            .then(response => {
                setSelectedPlan(response);
            })
            .catch(error => {
                console.info(error);
                notification.showSnackBarError('Произошла ошибка');
            })
            .finally(() => {
                setPlanFetching(false);
            })
    }

    function loadPlanRecords() {
        setPlanRecordsFetching(true);
        fetch(`http://localhost:3001/plans/${planId}/records`, {method: 'GET'})
            .then(response => response.json())
            .then(response => {
                setPlanRecords(response);
                if (response.length !== 0) {
                    setPlanDate(response[0][`date`]);
                }
            })
            .catch(error => {
                console.info(error);
                notification.showSnackBarError('Произошла ошибка');
            })
            .finally(() => {
                setPlanRecordsFetching(false);
            })
    }

    function addNewProduct() {
        setFetching(true);
        fetch(`http://localhost:3001/plans/${planId}/records/${selectedRecord['_id']}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                name: newProductInfo[`name`],
                meal: tabValue,
                sectionName: newProductInfo[`sectionName`],
                nutritionalValue: newProductInfo[`nutritionalValue`],
            })
        })
            .then(response => response.json())
            .then(response => {
                setPlanRecords(response);
                setNewProductInfo({
                    sectionName: '',
                    name: '',
                    nutritionalValue: '',
                    protein: '',
                    fat: '',
                    carbohydrates: '',
                    addInAllMeals: false,
                });
                notification.showSnackBarSuccess('Продукт успешно добавлен');
            })
            .catch(error => {
                console.info(error);
                notification.showSnackBarError('Произошла ошибка');
            })
            .finally(() => {
                setFetching(false);
            })
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleChangePlanDate = (event) => {
        setPlanDate(event.target.value);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleAddClick = () => {
        setAddProductDialogOpen(true);
    };

    const handleCancelAddNewProduct = () => {
        setAddProductDialogOpen(false);
    };

    const handleCancelAddNewRecord = () => {
        setAddRecordDialogOpen(false);
    };

    const handleInputChange = fieldName => event => {
        setNewProductInfo({
            ...newProductInfo,
            [fieldName]: event.target.value,
        });
    };

    const handleAddInAllMealsChange = (event) => {
        setNewProductInfo({
            ...newProductInfo,
            [event.target.name]: event.target.checked,
        });
    };

    const handleBackToMainMenuClick = () => {
        dispatch(push({
            pathname: `/fitCalories`,
            state: {prevLocation: !!history ? history.location : {}}
        }))
    };

    const handleSectionClick = useCallback((meal, sectionName) => {
        const newNutritionSectionOpen = JSON.parse(JSON.stringify(nutritionSectionOpen));
        newNutritionSectionOpen[meal][sectionName] = !newNutritionSectionOpen[meal][sectionName];
        setNutritionSectionOpen(newNutritionSectionOpen);
    }, [nutritionSectionOpen]);

    const handleAddProduct = () => {
        let canProceed = true;
        Object.keys(newProductInfo).forEach(key => {
            if (key !== 'addInAllMeals' && key !== 'protein' && key !== 'fat' && key !== 'carbohydrates' && !newProductInfo[key]) {
                canProceed = false;
            }
        });

        if (canProceed) {
            if (!newProductInfo[`addInAllMeals`] && tabValue === 'dinner' && newProductInfo[`sectionName`] === 'fat') {
                notification.showSnackBarWarning('Недопустимый раздел продукта для ужина');
            } else {
                addNewProduct();
            }
        } else {
            notification.showSnackBarWarning('Не заполнены обязательные поля');
            if (newProductInfo[`sectionName`] === '' && !!sectionNameInputRef && !!sectionNameInputRef.current) {
                sectionNameInputRef.current.focus();
            } else if (newProductInfo[`name`] === '' && !!nameInputRef && !!nameInputRef.current) {
                nameInputRef.current.focus();
            } else if (newProductInfo[`nutritionalValue`] === '' && !!nutritionalValueInputRef && !!nutritionalValueInputRef.current) {
                nutritionalValueInputRef.current.focus();
            }
        }
    };

    const handleCheckProduct = (meal, sectionName, productId) => {
        const selectedRecordCopy = JSON.parse(JSON.stringify(selectedRecord));
        const selectedSection = selectedRecordCopy[`records`][meal][sectionName][`records`];
        const sectionNutritionalValue = selectedRecordCopy[`records`][meal][sectionName][`nutritionalValue`];
        const selectedProduct = Object.assign({}, selectedSection.find((product) => product[`_id`] === productId));

        const indexOfSelectedProduct = selectedSection.findIndex((product) => product[`_id`] === productId);
        selectedSection[indexOfSelectedProduct][`checked`] = selectedProduct[`checked`] !== true;

        const amountOfProductsChecked = selectedSection.reduce((totalChecked, product) => (product[`checked`] === true ? totalChecked + 1 : totalChecked), 0);

        if (amountOfProductsChecked === 0) {
            selectedSection.map(product => {
                product[`left`] = product[`fullValue`];
            });
        } else {
            const checkedProducts = selectedSection.filter(product => {
                return product[`checked`] === true
            });

            const uncheckedProducts = selectedSection.filter(product => {
                return product[`checked`] !== true
            });

            uncheckedProducts.map(product => {
                product[`left`] = 0;
                product[`eaten`] = 0;
            });

            const sumNutritionalValue = checkedProducts.reduce((totalNutritionalValue, product) =>
                    (totalNutritionalValue + (product[`nutritionalValue`] * (product[`eaten`] ? Number(product[`eaten`]) : 0)) / 100)
                , 0);

            if (checkedProducts.every(product => product[`eaten`] === '' || product[`eaten`] === undefined || product[`eaten`] === 0)) {
                checkedProducts.map(product => {
                    product[`left`] = Math.round((sectionNutritionalValue - sumNutritionalValue) * 100 / product[`nutritionalValue`] / amountOfProductsChecked);
                });
            } else {
                checkedProducts.map(product => {
                    if (sumNutritionalValue > sectionNutritionalValue && (product[`eaten`] === '' || product[`eaten`] === 0)) {
                        product[`left`] = 0;
                    } else {
                        product[`left`] = Math.round((sectionNutritionalValue - sumNutritionalValue) * 100 / product[`nutritionalValue`]);
                    }
                });
            }
        }

        setSelectedRecord(selectedRecordCopy);
    };

    const handleEatenProductEdit = (meal, sectionName, productId) => (event) => {
        const selectedRecordCopy = JSON.parse(JSON.stringify(selectedRecord));
        const selectedSection = selectedRecordCopy[`records`][meal][sectionName][`records`];
        const sectionNutritionalValue = selectedRecordCopy[`records`][meal][sectionName][`nutritionalValue`];
        const indexOfSelectedProduct = selectedSection.findIndex((product) => product[`_id`] === productId);
        selectedSection[indexOfSelectedProduct][`eaten`] = Number(event.target.value);
        selectedSection[indexOfSelectedProduct][`checked`] = true;

        const checkedProducts = selectedSection.filter(product => {
            return product[`checked`] === true
        });

        const uncheckedProducts = selectedSection.filter(product => {
            return product[`checked`] !== true
        });

        const sumNutritionalValue = checkedProducts.reduce((totalNutritionalValue, product) =>
                (totalNutritionalValue + (product[`nutritionalValue`] * (product[`eaten`] ? Number(product[`eaten`]) : 0)) / 100)
            , 0);

        checkedProducts.map(product => {
            if (sumNutritionalValue > sectionNutritionalValue && (product[`eaten`] === '' || product[`eaten`] === 0)) {
                product[`left`] = 0;
            } else {
                product[`left`] = Math.round((sectionNutritionalValue - sumNutritionalValue) * 100 / product[`nutritionalValue`]);
            }
        });

        uncheckedProducts.map(product => {
            product[`left`] = 0;
        });

        setSelectedRecord(selectedRecordCopy);
    };

    const handleDeleteProduct = (meal, sectionName, productId) => {
        const selectedRecordCopy = JSON.parse(JSON.stringify(selectedRecord));
        const selectedRecordRecordsCopy = selectedRecordCopy[`records`];

        const selectedSection = selectedRecordCopy[`records`][meal][sectionName][`records`];
        const sectionNutritionalValue = selectedRecordCopy[`records`][meal][sectionName][`nutritionalValue`];
        const selectedProduct = Object.assign({}, selectedSection.find((product) => product[`_id`] === productId));

        const indexOfSelectedProduct = selectedSection.findIndex((product) => product[`_id`] === productId);
        selectedSection[indexOfSelectedProduct][`checked`] = selectedProduct[`checked`] !== true;

        const amountOfProductsChecked = selectedSection.reduce((totalChecked, product) => (product[`checked`] === true ? totalChecked + 1 : totalChecked), 0);

        if (amountOfProductsChecked === 0) {
            selectedSection.map(product => {
                product[`left`] = product[`fullValue`];
            });
        } else {
            const checkedProducts = selectedSection.filter(product => {
                return product[`checked`] === true
            });

            const uncheckedProducts = selectedSection.filter(product => {
                return product[`checked`] !== true
            });

            uncheckedProducts.map(product => {
                product[`left`] = 0;
                product[`eaten`] = 0;
            });

            const sumNutritionalValue = checkedProducts.reduce((totalNutritionalValue, product) =>
                    (totalNutritionalValue + (product[`nutritionalValue`] * (product[`eaten`] ? Number(product[`eaten`]) : 0)) / 100)
                , 0);

            if (checkedProducts.every(product => product[`eaten`] === '' || product[`eaten`] === undefined || product[`eaten`] === 0)) {
                checkedProducts.map(product => {
                    product[`left`] = Math.round((sectionNutritionalValue - sumNutritionalValue) * 100 / product[`nutritionalValue`] / amountOfProductsChecked);
                });
            } else {
                checkedProducts.map(product => {
                    if (sumNutritionalValue > sectionNutritionalValue && (product[`eaten`] === '' || product[`eaten`] === 0)) {
                        product[`left`] = 0;
                    } else {
                        product[`left`] = Math.round((sectionNutritionalValue - sumNutritionalValue) * 100 / product[`nutritionalValue`]);
                    }
                });
            }
        }

        selectedRecordRecordsCopy[meal][sectionName]['records'] =
            selectedRecordRecordsCopy[meal][sectionName]['records'].filter(product => {
                return product['_id'] !== productId;
            });

        setSelectedRecord(selectedRecordCopy);

        // setFetching(true);
        // fetch(`http://localhost:3001/plans/${planId}/records/${selectedRecord['_id']}`, {
        //     method: 'DELETE',
        //     headers: {
        //         'Content-Type': 'application/json;charset=utf-8'
        //     },
        //     body: JSON.stringify({
        //         meal: meal,
        //         sectionName: sectionName,
        //         productId: productId,
        //     })
        // })
        //     .then(response => response.json())
        //     .then(response => {
        //         setPlanRecords(response);
        //         notification.showSnackBarSuccess('Продукт успешно удален');
        //     })
        //     .catch(error => {
        //         console.info(error);
        //         notification.showSnackBarError('Произошла ошибка');
        //     })
        //     .finally(() => {
        //         setFetching(false);
        //     })
    };

    const handleAddRecord = () => {
        if (newRecordDate && newRecordDate.isValid()) {
            const newRecordFormattedDate = moment(newRecordDate, 'DD/MM/YYYY').format('DD/MM/YYYY');
            let ifDateAlreadyInUse = false;
            planRecords.map(record => {
                if (record[`date`] === newRecordFormattedDate) {
                    ifDateAlreadyInUse = true;
                }
            });
            if (ifDateAlreadyInUse) {
                notification.showSnackBarWarning('Запись с указанной датой уже существует');
            } else {
                setFetching(true);
                fetch(`http://localhost:3001/plans/${planId}/records`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({
                        date: newRecordFormattedDate,
                    })
                })
                    .then(response => response.json())
                    .then(response => {
                        setPlanRecords(response);
                        setPlanDate(newRecordFormattedDate);
                        setAddRecordDialogOpen(false);
                        setNewRecordDate(null);
                        notification.showSnackBarSuccess('Запись успешно добавлена');
                    })
                    .catch(error => {
                        console.info(error);
                        notification.showSnackBarError('Произошла ошибка');
                    })
                    .finally(() => {
                        setFetching(false);
                    })
            }
        } else {
            notification.showSnackBarWarning('Неверный формат даты');
        }
    };

    const handleDeleteRecord = () => {
        setFetching(true);
        fetch(`http://localhost:3001/plans/${planId}/records`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                recordId: selectedRecord[`_id`],
            })
        })
            .then(response => response.json())
            .then(response => {
                if (response.length !== 0) {
                    setPlanDate(response[0][`date`]);
                }
                setPlanRecords(response);
                notification.showSnackBarSuccess('Запись успешно удалена');
            })
            .catch(error => {
                console.info(error);
                notification.showSnackBarError('Произошла ошибка');
            })
            .finally(() => {
                setFetching(false);
            })
    };

    const handleCreateNewRecord = () => {
        setAddRecordDialogOpen(true);
    };

    const handleSaveRecord = () => {
        setFetching(true);
        fetch(`http://localhost:3001/plans/${planId}/records/${selectedRecord['_id']}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                records: selectedRecord[`records`],
            })
        })
            .then(response => response.json())
            .then(response => {
                setPlanRecords(response);
                notification.showSnackBarSuccess('Запись успешно сохранена');
            })
            .catch(error => {
                console.info(error);
                notification.showSnackBarError('Произошла ошибка');
            })
            .finally(() => {
                setFetching(false);
            })
    };

    const calculateLabel = () => {
        let totalKkal = 0;
        Object.keys(mealsKal).forEach(key => {
            totalKkal = totalKkal + mealsKal[key];
        });
        return `${Math.round(totalKkal)} Ккал`
    };

    return <div className={classes.root}>
        {fetching && <LinearProgress color={'secondary'} className={classes.progress}/>}
        <AppBar
            position={'static'}
            className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
            })}
        >
            <Toolbar>
                <IconButton
                    color={'inherit'}
                    aria-label={'open drawer'}
                    onClick={handleDrawerOpen}
                    edge={'start'}
                    className={clsx(classes.menuButton, open && classes.hide)}
                >
                    <MenuIcon/>
                </IconButton>
                <div>
                    {selectedPlan[`name`] &&
                    <Typography variant={'h6'} noWrap style={{color: '#fff', margin: 'auto'}}>
                        {`План на ${selectedPlan[`name`]} ккал`}
                    </Typography>}
                </div>
                <Tabs value={tabValue} onChange={handleTabChange}
                      classes={{root: classes.tabs, indicator: classes.tabIndicator}}>
                    <Tab classes={{root: classes.tab}} value={'breakfast'}
                         label={`Завтрак ${mealsKal[`breakfast`]} ккал`}/>
                    <Tab classes={{root: classes.tab}} value={'lunch'} label={`Обед ${mealsKal[`lunch`]} ккал`}/>
                    <Tab classes={{root: classes.tab}} value={'dinner'} label={`Ужин ${mealsKal[`dinner`]} ккал`}/>
                </Tabs>
                <div style={{flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <Tooltip
                        arrow={true}
                        title={'Итоговая калорийность за день'}
                        classes={{
                            tooltip: classes.tooltip,
                        }}
                        interactive={true}
                    >
                        <Chip
                            classes={{colorPrimary: classes.chip, avatar: classes.avatar}}
                            color={'primary'}
                            avatar={
                                <Avatar>
                                    <FunctionsIcon/>
                                </Avatar>
                            }
                            label={calculateLabel()}
                        />
                    </Tooltip>
                    <Button
                        id={'saveButton'}
                        onClick={handleSaveRecord}
                        variant={'contained'}
                        classes={{root: classes.button}}
                        color={'secondary'}
                        disabled={fetching || planDate === '' || planRecords.length === 0}
                    >
                        Сохранить
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
        <Drawer
            className={classes.drawer}
            variant={'persistent'}
            anchor={'left'}
            open={open}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.drawerHeader}>
                <IconButton onClick={handleDrawerClose} style={{color: '#fff'}}>
                    <ChevronLeftIcon/>
                </IconButton>
            </div>

            {planRecords.length !== 0 &&
            <FormControl variant={'outlined'} className={classes.formControl}>
                <InputLabel id={'plan-date-label'} style={{color: '#fff'}}>Дата</InputLabel>
                <Select
                    labelId={'plan-date-label'}
                    id={'plan-date-select'}
                    value={planDate}
                    onChange={handleChangePlanDate}
                    label={'Дата'}
                    disabled={fetching}
                    style={{color: '#fff'}}
                    MenuProps={{
                        classes: {paper: classes.menu}
                    }}
                >
                    {planRecords.map((record, index) => {
                        return <MenuItem key={`planDateMenuItem${index}`}
                                         value={record[`date`]}>{record['date']}</MenuItem>
                    })}
                </Select>
            </FormControl>}

            <List>
                <ListItem button onClick={handleCreateNewRecord} disabled={fetching}>
                    <ListItemIcon style={{color: '#fff'}}><AddCircleIcon/></ListItemIcon>
                    <ListItemText primary={'Создать новую запись'}/>
                </ListItem>
                {planRecords && planRecords.length !== 0 &&
                <ListItem button onClick={handleDeleteRecord} disabled={fetching}>
                    <ListItemIcon style={{color: '#fff'}}><RemoveCircleIcon/></ListItemIcon>
                    <ListItemText primary={'Удалить текущую запись'}/>
                </ListItem>}
                <ListItem button onClick={handleBackToMainMenuClick} disabled={fetching}>
                    <ListItemIcon style={{color: '#fff'}}><ExitToAppIcon/></ListItemIcon>
                    <ListItemText primary={'Вернуться в главное меню'}/>
                </ListItem>
            </List>
        </Drawer>
        <div className={clsx(classes.content, {[classes.contentShift]: open})}>
            <Scrollbars style={{width: '100%', height: '100%'}}>
                {planRecords.length !== 0 && <div style={{marginBottom: 10, minWidth: 550}}>
                    <NutritionTableTemplate
                        handleSectionClick={handleSectionClick}
                        icon={<BsFillEggFill/>}
                        nutritionSectionOpen={nutritionSectionOpen}
                        tabValue={tabValue}
                        sectionName={'protein'}
                        rusSectionName={'Белки'}
                        selectedRecord={selectedRecord}
                        handleCheckProduct={handleCheckProduct}
                        handleEatenProductEdit={handleEatenProductEdit}
                        handleDeleteProduct={handleDeleteProduct}
                        fetching={fetching}
                    />

                    {tabValue !== 'dinner' && <NutritionTableTemplate
                        handleSectionClick={handleSectionClick}
                        icon={<FaCheese/>}
                        nutritionSectionOpen={nutritionSectionOpen}
                        tabValue={tabValue}
                        sectionName={'fat'}
                        rusSectionName={'Жиры'}
                        selectedRecord={selectedRecord}
                        handleCheckProduct={handleCheckProduct}
                        handleEatenProductEdit={handleEatenProductEdit}
                        handleDeleteProduct={handleDeleteProduct}
                        fetching={fetching}
                    />}

                    <NutritionTableTemplate
                        handleSectionClick={handleSectionClick}
                        icon={<FaBreadSlice/>}
                        nutritionSectionOpen={nutritionSectionOpen}
                        tabValue={tabValue}
                        sectionName={'carbohydrates'}
                        rusSectionName={'Углеводы'}
                        selectedRecord={selectedRecord}
                        handleCheckProduct={handleCheckProduct}
                        handleEatenProductEdit={handleEatenProductEdit}
                        handleDeleteProduct={handleDeleteProduct}
                        fetching={fetching}
                    />
                </div>}

                {planRecords.length === 0 && fetching === false && <React.Fragment>
                    <div style={{margin: 10, display: 'flex', alignItems: 'center'}}>
                        <Typography variant={'h6'} style={{marginRight: 5}}>
                            В текущем плане записи не найдены
                        </Typography>
                        <MoodBadIcon/>
                    </div>
                    <div style={{margin: 10, display: 'flex', alignItems: 'center'}}>
                        <CallReceivedIcon style={{transform: 'rotate(80deg)'}}/>
                        <Typography variant={'h6'} style={{marginLeft: 5}}>
                            Создайте пожалуйста новую запись в меню слева
                        </Typography>
                    </div>
                </React.Fragment>}
            </Scrollbars>

            {planRecords.length !== 0 &&
            <Fab aria-label={'add'} className={classes.fabButton} onClick={handleAddClick} disabled={fetching}>
                <AddIcon/>
            </Fab>}
        </div>

        <Dialog
            open={addProductDialogOpen}
            aria-labelledby={'add-product-dialog'}
            fullWidth={true}
            classes={{
                paper: classes.dialog,
            }}
        >
            <DialogTitle id={'add-product-dialog'}>Добавление нового продукта</DialogTitle>
            <DialogContent dividers>
                <TextField
                    autoFocus={true}
                    id={'sectionName'}
                    select={true}
                    label={'Раздел'}
                    value={newProductInfo[`sectionName`]}
                    onChange={handleInputChange('sectionName')}
                    variant={'outlined'}
                    fullWidth={true}
                    style={{marginBottom: 10}}
                    required={true}
                    inputRef={sectionNameInputRef}
                >
                    {[{value: 'protein', label: 'Белки'}, {value: 'fat', label: 'Жиры'}, {
                        value: 'carbohydrates',
                        label: 'Углеводы'
                    }].map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id={'name'}
                    label={'Наименование продукта'}
                    value={newProductInfo[`name`]}
                    variant={'outlined'}
                    onChange={handleInputChange('name')}
                    fullWidth={true}
                    style={{marginBottom: 10}}
                    autoComplete={'off'}
                    required={true}
                    inputRef={nameInputRef}
                />
                <TextField
                    id={'nutritionalValue'}
                    label={'Калорийность на 100г'}
                    value={newProductInfo[`nutritionalValue`]}
                    variant={'outlined'}
                    onChange={handleInputChange('nutritionalValue')}
                    fullWidth={true}
                    style={{marginBottom: 10}}
                    InputProps={{
                        type: 'number',
                    }}
                    required={true}
                    inputRef={nutritionalValueInputRef}
                />
                <TextField
                    id={'protein'}
                    label={'Белки в 100г'}
                    value={newProductInfo[`protein`]}
                    variant={'outlined'}
                    onChange={handleInputChange('protein')}
                    fullWidth={true}
                    style={{marginBottom: 10}}
                    InputProps={{
                        type: 'number',
                    }}
                />
                <TextField
                    id={'fat'}
                    label={'Жиры в 100г'}
                    value={newProductInfo[`fat`]}
                    variant={'outlined'}
                    onChange={handleInputChange('fat')}
                    fullWidth={true}
                    style={{marginBottom: 10}}
                    InputProps={{
                        type: 'number',
                    }}
                />
                <TextField
                    id={'carbohydrates'}
                    label={'Углеводы в 100г'}
                    value={newProductInfo[`carbohydrates`]}
                    variant={'outlined'}
                    onChange={handleInputChange('carbohydrates')}
                    fullWidth={true}
                    style={{marginBottom: 10}}
                    InputProps={{
                        type: 'number',
                    }}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={newProductInfo[`addInAllMeals`]}
                            onChange={handleAddInAllMealsChange}
                            name={'addInAllMeals'}
                            classes={{colorSecondary: classes.checkbox, checked: classes.checkbox}}
                        />
                    }
                    label={'Добавить во все приемы пищи'}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    id={'addButton'}
                    onClick={handleAddProduct}
                    variant={'contained'}
                    classes={{root: classes.button}}
                    color={'primary'}
                >
                    Добавить
                </Button>

                <Button
                    onClick={handleCancelAddNewProduct}
                    classes={{root: classes.button}}
                >
                    Закрыть
                </Button>
            </DialogActions>
        </Dialog>

        <Dialog
            open={addRecordDialogOpen}
            aria-labelledby={'add-product-dialog'}
            fullWidth={true}
            maxWidth={false}
            classes={{
                paper: classes.addRecordDialog
            }}
        >
            <DialogTitle id={'add-product-dialog'}>Добавление новой записи</DialogTitle>
            <DialogContent dividers>
                <KeyboardDatePicker
                    clearable={false}
                    value={newRecordDate ? moment(newRecordDate, 'DD/MM/YYYY') : null}
                    onChange={date => setNewRecordDate(date)}
                    format={'DD/MM/YYYY'}
                    cancelLabel={'Отмена'}
                    okLabel={'Выбрать'}
                    autoOk={true}
                    invalidDateMessage={''}
                    minDateMessage={'Дата должна быть после минимальной'}
                    maxDateMessage={'Дата должна быть до максимальной'}
                    autoFocus={true}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    id={'addButton'}
                    onClick={handleAddRecord}
                    variant={'contained'}
                    color={'primary'}
                    classes={{root: classes.button}}
                >
                    Добавить
                </Button>

                <Button
                    onClick={handleCancelAddNewRecord}
                    classes={{root: classes.button}}
                >
                    Отмена
                </Button>
            </DialogActions>
        </Dialog>
    </div>
}

export default PlanView;
