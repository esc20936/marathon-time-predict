"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { sendTrainingData, sendAdvancedTrainingData } from "@/utils/api/send";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  km4week: z
    .number()
    .min(0, "Must be a positive number")
    .max(150, "Seems too high, are you sure?"),
  sp4week: z
    .number()
    .min(0, "Must be a positive number")
    .max(90, "Seems too high, are you sure?"),
  cross_training: z.boolean().default(false),
  time: z.number().min(0, "Must be a non-negative number"),
  // Advanced Model fields
  GENDER: z.enum(["male", "female"]),
  AGE: z.number().min(0, "Must be a non-negative number"),
  ATMOS_PRESS_mbar: z
    .number()
    .min(800, "Unlikely atmospheric pressure")
    .max(1100, "Unlikely atmospheric pressure"),
  AVG_TEMP_C: z.number().min(-30, "Too low").max(50, "Too high"),
});

export default function SendData() {
  const [prediction, setPrediction] = useState<string | null>(null);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (darkMode) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  }, [darkMode]);

  const mutation = useMutation({
    mutationFn: sendTrainingData,
    onSuccess: (_) => {
      setPrediction("Se envió su data correctamente");
    },

    onError: () => {
      alert("An error occurred, please try again later");
      setPrediction(null);
    },
  });


  const mutation2 = useMutation({
    mutationFn: sendAdvancedTrainingData,
    onSuccess: (_) => {
      setPrediction("Se envió su data correctamente");
    },

    onError: () => {
      alert("An error occurred, please try again later");
      setPrediction(null);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      km4week: 0,
      sp4week: 0,
      cross_training: false,
      time: 0,
      GENDER: "male",
      AGE: 0,
      ATMOS_PRESS_mbar: 1013,
      AVG_TEMP_C: 20,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setPrediction(null);

    if (mutation.isPending) return;

    if(darkMode){
      mutation2.mutate(values);
      return;
    }

    mutation.mutate(values);
  }

  const handleTabChange = (value: string) => {
    setPrediction(null);

    // set dark mode
    setDarkMode(value === "advanceModel");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 dark:bg-[#1E1E1E]">
      <Tabs
        defaultValue="simpleModel"
        className="w-full max-w-md "
        onValueChange={(value) => {
          handleTabChange(value);
        }}
      >
        <TabsList className="grid w-full grid-cols-2 ">
          <TabsTrigger value="simpleModel">Simple Model</TabsTrigger>
          <TabsTrigger value="advanceModel">advance Model</TabsTrigger>
        </TabsList>
        <TabsContent value="simpleModel">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                simple Run Wizard
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="km4week"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kilometros recorridos</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter total kilometers"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : null
                              )
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Ingresa la cantidad de kilometros recorridos en el
                          ultimo mes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sp4week"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Velocidad promedio</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="Enter average speed"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : null
                              )
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Ingresa la velocidad promedio (Km/h)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cross_training"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            ¿Realizas otro tipo de entrenamiento?
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiempo de Maratón</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step={1}
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value ? parseInt(e.target.value) : 0)
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Ingrese su tiempo total en segundos.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    {mutation.isPending ? (
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      </div>
                    ) : (
                      <>
                        Predecir
                        <Sparkles className="mr-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
              {prediction && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {prediction}
                    </CardTitle>
                  </CardHeader>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="advanceModel">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Advanced {" "}
                <span className=" colorText">
                Run Wizard
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Gender Field */}
                  <FormField
                    control={form.control}
                    name="GENDER"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Age Field */}
                  <FormField
                    control={form.control}
                    name="AGE"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter age"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : null
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Atmospheric Pressure Field */}
                  <FormField
                    control={form.control}
                    name="ATMOS_PRESS_mbar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Atmospheric Pressure (mbar)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter atmospheric pressure"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : null
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Average Temperature Field */}
                  <FormField
                    control={form.control}
                    name="AVG_TEMP_C"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Average Temperature (°C)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter average temperature"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : null
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiempo de Maratón</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step={1}
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value ? parseInt(e.target.value) : 0)
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Ingrese su tiempo total en segundos.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full dark:bg-black dark:text-white"
                  >
                    {mutation.isPending ? (
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      </div>
                    ) : (
                      <>
                        Predict <Sparkles className="mr-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
              {/* Prediction Output */}
              {prediction && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {prediction}
                    </CardTitle>
                  </CardHeader>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
