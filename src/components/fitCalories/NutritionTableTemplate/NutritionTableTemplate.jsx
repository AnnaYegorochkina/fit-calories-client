import React from 'react';

import {makeStyles, withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import NumberFormat from 'react-number-format';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import {FaTrash} from 'react-icons/fa';

const useStyles = makeStyles(() => ({
    listPadding: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    listItem: {
        padding: 15,
    },
}));

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

const StyledTableCellHeader = withStyles(() => ({
    head: {
        backgroundColor: '#05396b',
        color: 'white',
        padding: '16px',
        borderBottom: 'none',
    },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: '#edf5e0',
        },
        '&:nth-of-type(even)': {
            backgroundColor: 'white',
        },
    },
}))(TableRow);

function NutritionTableTemplate(props) {
    const {
        handleSectionClick,
        icon,
        nutritionSectionOpen,
        tabValue,
        sectionName,
        rusSectionName,
        selectedRecord,
        handleCheckProduct,
        handleEatenProductEdit,
        handleDeleteProduct,
        fetching,
    } = props;

    const classes = useStyles();

    function prepareRecordLeft(value) {


        const valueString = JSON.parse(JSON.stringify(value)) + '';
        if (valueString[0] === '-') {
            return <div style={{display: 'flex', alignItems: 'center'}}>
                <KeyboardArrowDownIcon style={{color: 'red'}}/>
                <p>{valueString.slice(1)}</p>
            </div>
        } else if (valueString === '0') {
            return <p style={{marginLeft: 25}}>{valueString}</p>
        } else {
            return <div style={{display: 'flex', alignItems: 'center'}}>
                <KeyboardArrowUpIcon style={{color: '#5cdb94'}}/>
                <p>{valueString}</p>
            </div>
        }
    }

    return <List classes={{root: classes.list, padding: classes.listPadding}}>
        <ListItem
            classes={{root: classes.listItem}}
            button={true}
            onClick={() => handleSectionClick(tabValue, sectionName)}
        >
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText primary={rusSectionName}/>
            {nutritionSectionOpen[tabValue][sectionName] ? <ExpandLess/> : <ExpandMore/>}
        </ListItem>
        <Collapse in={nutritionSectionOpen[tabValue][sectionName]} timeout="auto" unmountOnExit>
            <TableContainer component={'div'}>
                <Table aria-label={sectionName} size={'small'}>
                    <TableHead>
                        <TableRow>
                            <StyledTableCellHeader> </StyledTableCellHeader>
                            <StyledTableCellHeader>Наименование</StyledTableCellHeader>
                            <StyledTableCellHeader>Осталось съесть (грамм)</StyledTableCellHeader>
                            <StyledTableCellHeader>Съедено (грамм)</StyledTableCellHeader>
                            <StyledTableCellHeader> </StyledTableCellHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedRecord[`records`] && selectedRecord[`records`][tabValue] &&
                        selectedRecord[`records`][tabValue][sectionName] &&
                        selectedRecord[`records`][tabValue][sectionName][`records`].map((record) => (
                            <StyledTableRow key={record[`name`]}>
                                <TableCell>
                                    <Checkbox checked={record[`checked`] === true} classes={{
                                        colorSecondary: classes.checkbox,
                                        checked: classes.checkbox
                                    }}
                                              onChange={() => handleCheckProduct(tabValue, sectionName, record[`_id`])}
                                    />
                                </TableCell>
                                <TableCell align={'left'}>{record[`name`]}</TableCell>
                                <TableCell align={'left'}>{prepareRecordLeft(record[`left`])}</TableCell>
                                <TableCell align={'left'}>
                                    <TextField
                                        value={record[`eaten`] || ''}
                                        onChange={handleEatenProductEdit(tabValue, sectionName, record[`_id`])}
                                        InputProps={{
                                            inputComponent: NumberFormatCustom,
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        disabled={fetching}
                                        style={{fontSize: 16}}
                                        onClick={() => handleDeleteProduct(tabValue, sectionName, record[`_id`])}
                                    >
                                        <FaTrash/>
                                    </IconButton>
                                </TableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Collapse>
    </List>
}

export default NutritionTableTemplate;
