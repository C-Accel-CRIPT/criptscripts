import { finished } from 'stream';
import { promisify } from 'util';
 
// Defining finishedAsync method
// @see https://www.geeksforgeeks.org/node-js-stream-finished-method/
export const finishedAsync = promisify(finished);