import AppLayout from "@/layouts/app-layout";
import dash from "@/routes/dash";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import ServerTable from "./table";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import z, { string } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SenderType, ServerType } from "@/types/user";
import { SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Servers',
        href: dash.server.lists().url,
    },
];


export default function ServerListPage(request: any) {
    const mode = request.server ? 'edit' : 'add';
    console.log(mode)
    request.server as ServerType;

    const schema = z.object({
        // credits
        sync_url: z.string().min(1, { message: "ห้ามว่าง" }),
        sync_method: z.string().min(1, { message: "ห้ามว่าง" }),
        callback: z.array(z.string()).optional(),
    });
    type FormValues = z.infer<typeof schema>;
    const defaultValues: FormValues = mode === "add"
        ? {
            sync_url: "",
            sync_method: "",
            callback: ["param", "{credit}"],
        }
        : {
            sync_url: request.server?.settings.credits.sync_url,
            sync_method: request.server?.settings.credits.sync_method,
            callback: request.server?.settings.credits.callback,
        };

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues,
        mode: "onChange",
    });

    function submit() {

    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="px-4">
                    <Form
                        {...form}
                    >
                        <form onSubmit={form.handleSubmit(submit)}>
                            <div className="flex flex-col gap-4 w-full">
                                <div className="flex justify-between w-full">
                                    <Label className="text-lg">credit settings</Label>
                                    <GetCredit item={request.server ?? {}} />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="sync_url"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">url</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sync_method"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">method</FormLabel>
                                            <FormControl>
                                                <SelectMethod value={field.value} defaultValue={field.value} onValueChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="callback"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel className="capitalize">callback</FormLabel>
                                            <FormControl>
                                                <div className="flex gap-4">
                                                    {field.value?.map((item: string, index: number) => (
                                                        <Input
                                                            key={index}
                                                            value={item}
                                                            onChange={(e) => {
                                                                const newValue = [...(field.value || [])];
                                                                newValue[index] = e.target.value;
                                                                field.onChange(newValue); // 🔑 update array ใน form
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                            </div>

                        </form>
                    </Form>
                </Card>
            </div>
        </AppLayout>
    );
}


function SelectMethod({
    value,
    defaultValue,
    onValueChange
}: {
    value?: string;
    defaultValue?: string;
    onValueChange?: (e: string | undefined) => void;
}) {
    const items = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTION'];

    return (
        <Select value={value} onValueChange={onValueChange} defaultValue={defaultValue}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {items.map((item: string, key: number) => (
                        <SelectItem key={key} value={item}>{item}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}


function GetCredit({item}:{item: ServerType}){
    const [credit, setCreadit] = useState<number>(item.settings.credits.amount ?? 0);

    return(
        <div className="text-xl text-primary">
            {credit.toLocaleString()} เครดิต
        </div>
    );
}
