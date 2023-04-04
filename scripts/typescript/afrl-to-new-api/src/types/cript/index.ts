import { IAlgorithm } from './IAlgorithm';
import { ICitation } from './ICitation';
import { ICollection } from './ICollection.';
import { IComputation } from './IComputation';
import { IComputationProcess } from './IComputationProcess';
import { ICondition } from './ICondition.';
import { IData } from './IData';
import { IExperiment } from './IExperiment';
import { IFile } from './IFile';
import { IIdentifier } from './IIdentifier';
import { IIngredient } from './IIngredient';
import { IInventory } from './IInventory';
import { IMaterial } from './IMaterial';
import { IParameter } from './IParameter';
import { IProperty } from './IProperty';
import { IProcess } from './IProcess';
import { IProject } from './IProject';
import { IReference } from './IReference';
import { IUser } from './IUser';
import { ISoftware } from './ISoftware';
import { ISoftwareConfiguration } from './ISoftwareConfiguration';
import { IVocabBase, IVocabIdentifier, IVocabProperty, IVocabQuantity, IVocab, IControlledVocabulary } from './IVocab';
import { EditorMode } from './EditorMode';
import { IQuantity } from './IQuantity';
import { IEquipment } from './IEquipment';

export type IPrimary =
  | ICollection
  | IComputation
  | IComputationProcess
  | IData
  | IExperiment
  | IFile
  | IInventory
  | IMaterial
  | IProcess
  | IProject
  | ISoftware;

export type Item = IPrimary | ICitation | IReference | IUser;

export type {
  IAlgorithm,
  ICitation,
  ICollection,
  IComputation,
  IComputationProcess,
  ICondition,
  IData,
  IExperiment,
  IEquipment,
  IFile,
  IIdentifier,
  IIngredient,
  IInventory,
  IMaterial,
  IParameter,
  IProperty,
  IProcess,
  IProject,
  IQuantity,
  IReference,
  ISoftware,
  ISoftwareConfiguration,
  IUser,
  IVocab,
  IVocabBase,
  IVocabIdentifier,
  IVocabProperty,
  IVocabQuantity,
  EditorMode,
  IControlledVocabulary,
};

export type Slug =
  | 'Citation' // FIXME: Citation is not a node, it is a sub-object (see p24 in the data model)
  | 'Collection'
  | 'Computation'
  | 'ComputationProcess'
  | 'Data'
  | 'Experiment'
  | 'File'
  | 'Inventory'
  | 'Material'
  | 'Process'
  | 'Project'
  | 'Reference'
  | 'Software'
  | 'User';


export interface IResult<T> {
  code?: number;
  data?: T[];
  error?: string;
}

export interface IPaginatedResult<T> {
  code: number;
  data: {
    count: number;
    limit: number;
    result: T[];
  };
  error: string;
}
