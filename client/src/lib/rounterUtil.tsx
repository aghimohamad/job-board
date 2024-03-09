import {defer, LoaderFunctionArgs, useLoaderData} from "react-router-dom";
import {AwaitProps as AwaitPropsReactRouter, Await as AwaitReactRouter} from "react-router-dom";



// the DefferedLoader function is a higher-order function that takes a function as an argument and returns a new function.
// The new function returns a promise that resolves to the result of the original function call.
// it basically returns the normal loader function that accepts the LoaderFunctionArgs and returns a call to defer with the passed (dataFn) function call as an argument.
// the flow is like this myListingsLoader({params}) will mean calling the returned function from DefferedLoader with the params as an argument which will then call the passed function with the LoaderFunctionArgs as an argument and return the result of the defer function call with the result of the passed function call as an argument.
export function DeferredLoader<T extends Record<string, unknown>>(
    dataFn: (args: LoaderFunctionArgs) => T
) {
    return function (args: LoaderFunctionArgs) {
        return defer(dataFn(args)) as Omit<ReturnType<typeof defer>, "data"> & {data: T}
    }
}

// the useDeferredLoaderData function is a custom hook that returns the data from the useLoaderData hook as the result of the DeferredLoader function call.

// the T is the return type of the DeferredLoader function call which is the function that takes args and return the call of defer with the passed function call as an argument.

// the type then is casted to the ReturnType of that function call and the data property is returned.

// T is function (args: LoaderFunctionArgs) {
//         return defer(dataFn(args)) as Omit<ReturnType<typeof defer>, "data"> & {data: T}
//     } basically the loader type function that returns a promise that resolves to the result of the original function call.
export function useDeferredLoaderData<T extends ReturnType<typeof DeferredLoader>> () {
    return useLoaderData() as ReturnType<T>["data"]
}

type AwaitProps<T> = Omit<AwaitPropsReactRouter, "children" | "resolve"> & {
    children : (data: Awaited<T>) => React.ReactNode
    resolve: Promise<T>
}

export function Await<T>(props:AwaitProps<T> ) {
    return <AwaitReactRouter {...props} />
}