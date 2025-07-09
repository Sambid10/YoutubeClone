import {inferRouterOutputs} from "@trpc/server"
import { AppRouter } from "@/trpc/routers/_app"


export type videoGetOneOutput=inferRouterOutputs<AppRouter>["video"]["getOne"]

export type commentGetManyOutput=inferRouterOutputs<AppRouter>["Comments"]["getMany"]["items"]

export type videoGetmanyOuput=inferRouterOutputs<AppRouter>["Suggestion"]["getMany"]

export type userGetmanyOutput=inferRouterOutputs<AppRouter>["User"]["getMany"]