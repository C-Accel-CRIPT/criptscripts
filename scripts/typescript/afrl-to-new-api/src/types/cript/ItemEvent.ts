export type ItemEvent<T> = {
    key: string;
    /** event type */
    type: 'create' | 'update' | 'delete' | 'edit';
    /** The item affected */
    value: T;
}