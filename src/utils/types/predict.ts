export interface predictBody {
    km4week: number;
    sp4week: number;
    cross_training: boolean;
};

export interface predictAdvancedBody {
  GENDER: "male" | "female";
  AGE: number;
  ATMOS_PRESS_mbar: number;
  AVG_TEMP_C: number;
}