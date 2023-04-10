export type ListEvent<T> = {
    /** list identifier */
    key: string;
    /** event type */
    type: 'create' | 'update' | 'delete' | 'edit';
    /** The item affected */
    value: T;
    /** The updated array */
    arr: T[];
}

export type ListEventHandle<T> = (event: ListEvent<T>) => void;
