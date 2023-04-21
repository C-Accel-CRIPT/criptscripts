import { Row, Column } from "../types";

export function logColumn(rows: Row[], column: Column) {
    for( let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const value = rows[rowIndex][column];
        console.log(JSON.stringify(value, null, ''));
    }
}