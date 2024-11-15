export interface sendBody {
    km4week: number;
    sp4week: number;
    cross_training: boolean;
    time: number;
};

export interface sendAdvancedBody {
  GENDER: "male" | "female";
  AGE: number;
  ATMOS_PRESS_mbar: number;
  AVG_TEMP_C: number;
  time: number;

}