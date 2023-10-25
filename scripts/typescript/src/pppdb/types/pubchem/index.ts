export type PubChemPropertyResponse = {
  PropertyTable: {
    Properties: Array<{
      CID: number;
      CanonicalSMILES: string;
      InChI: string;
      MolecularFormula: string;
      InChIKey: string;
    }>;
  };
};

export type PubChemCASResponse = {
  Record: {
    RecordType: string;
    RecordNumber: number;
    RecordTitle: string;
    Section: Array<{
      TOCHeading: string;
      Description: string;
      Section: Array<{
        TOCHeading: string;
        Description: string;
        Section: Array<{
          TOCHeading: string;
          Description: string;
          URL: string;
          Information: Array<{
            ReferenceNumber: number;
            Value: {
              StringWithMarkup: Array<{                                
                String: string; // <<<------------------- !!! CAS is here !!!
              }>;
            };
            URL?: string;
            Name?: string;
          }>;
        }>;
      }>;
    }>;
    Reference: Array<{
      ReferenceNumber: number;
      SourceName: string;
      SourceID: string;
      Name: string;
      Description: string;
      URL: string;
      LicenseNote?: string;
      LicenseURL: string;
      ANID: number;
      IsToxnet?: boolean;
    }>;
  };
};
