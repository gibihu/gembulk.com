import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { normalizePhones } from "@/lib/phone-filter";
import { useDetectSpamWord } from "@/lib/spam-word";
import api from "@/routes/api";
import dash from "@/routes/dash";
import { BreadcrumbItem } from "@/types";
import { PlanType, SenderType, ServerType, UserType } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'ส่ง sms',
        href: dash.create.sms().url,
    },
];
export default function SmsAddPage(request: any) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
    const [user, setUser] = useState<UserType>(request.auth.user ?? {} as UserType);
    const [plan, setPlan] = useState<PlanType>(request.auth.user.plan ?? {} as PlanType);
    const [servers, setServers] = useState<ServerType[]>(request.auth.user.plan.servers ?? {} as ServerType[]);
    const [isFetch, setIsFetch] = useState<boolean>(false);
    const [selectedSender, setSelectedSender] = useState<string>("");
    const [countReceivers, setCountReceivers] = useState<number>(0);
    const [phoneAfterFilter, setPhoneAfterFilter] = useState<string[]>([]);
    const [hasBadWord, setHasBadWord] = useState<boolean>(false);
    const [detectdBadWord, setDetecBadWord] = useState<string[]>([]);

    useEffect(() => {
        console.log(request);
    }, []);

    const schema = z.object({
        sender: z.string().min(1, { message: "ห้ามว่าง" }),
        receivers: z.string().min(1, { message: "ห้ามว่าง" }),
        msg: z.string().min(1, { message: "ต้องมีข้อความอย่างน้อย 1 ตัวอักษร" }),
        phone_counts: z.number(),
    });
    type FormValues = z.infer<typeof schema>;
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            sender: servers[0]?.senders?.[0]?.id,
            receivers: '',
            phone_counts: countReceivers,
        },
        mode: "onChange",
    });
    const watchedReceivers = form.watch("receivers");

    useEffect(() => {
        const p = normalizePhones(watchedReceivers ?? '');
        setPhoneAfterFilter(p);
        setCountReceivers(p.length);
    }, [watchedReceivers]); // watch ค่าแล้วใส่ dependency เป็นตัวแปร

    function submit(data: FormValues) {
        const fetchData = async () => {
            try {
                const res = await fetch(api.dash.create.sms().url, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({
                        sender: data.sender,
                        sd_server: servers[0].id,
                        receivers: phoneAfterFilter,
                        msg: data.msg,
                        msg_length: data.msg.length,
                        cost: data.msg.length > 70 ? 2 : 1,
                        phone_counts: countReceivers,
                    })
                });

                const result = await res.json();
                if (result.code == 201) {
                    toast.success(result.message);
                    router.reload();
                    form.reset();
                    router.visit(dash.jobs.sms().url);
                } else {
                    toast.error(result.message, { description: result.description ?? '' });
                }

            } catch (error) {
                console.error('Error:', error);
                let message = "เกิดข้อผิดพลาดบางอย่าง";

                if (error instanceof Error) {
                    message = error.message;
                } else if (typeof error === "string") {
                    message = error;
                }

                toast.error(message);
            } finally {
                setIsFetch(false);
            }
        }
        if (countReceivers > 0) {
            const detectd = useDetectSpamWord(data.msg, request.spam_word);
            console.log(detectd);
            if (detectd.length > 0) {
                setHasBadWord(true);
                setDetecBadWord(detectd as string[]);
            } else {
                setDetecBadWord([]);
                fetchData();
            }
        } else {
            form.setError('receivers', {
                type: 'manual',      // ประเภท error
                message: 'ไม่พบเบอร์โทร', // ข้อความที่จะแสดง
            });
        }
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                <Form
                    {...form}
                >
                    <form onSubmit={form.handleSubmit(submit)}>
                        <Card className="px-4 shadow-lg">
                            <FormField
                                control={form.control}
                                name="sender"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>รหัสผู้ส่ง</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a fruit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {servers.map((server: ServerType, index: number) => (
                                                        <SelectGroup key={index}>
                                                            {server.senders.map((sender: SenderType, key: number) => (
                                                                <SelectItem key={key} value={sender.id}>{sender.name}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="receivers"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>หมายเลขโทนศัพมือถือ</FormLabel>
                                        <FormControl>
                                            <Textarea className="h-24" placeholder="098...." disabled={isFetch} {...field}></Textarea>
                                        </FormControl>
                                        <FormDescription className="w-full flex gap-4 justify-between">
                                            <span>สามารเพิ่มเบอร์ได้มากกว่าา 1 เบอร์โดยใช้ <span className="bg-primary/50 text-primary-foreground rounded-full py-0 px-0.5">,</span> <span className="bg-primary/50 text-primary-foreground rounded-full py-0 px-0.5">;</span> หรือ <span className="bg-primary/50 text-primary-foreground rounded-full py-0 px-0.5">Enter</span> เพื่มเพิ่มเบอร์</span>
                                            <span>{countReceivers}</span>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="msg"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>ข้อความ</FormLabel>
                                        <FormControl>
                                            <Textarea className="h-24" placeholder="e.g Hello World!...." disabled={isFetch} {...field}></Textarea>
                                        </FormControl>
                                        <div className="w-full flex justify-between gap-4">
                                            {!fieldState.error ? (
                                                <FormDescription>
                                                    ข้อความากกว่า 70 อักษรจะคิด 2 เครดิต
                                                </FormDescription>
                                            ) : (
                                                <FormMessage />
                                            )}
                                            <span className="text-sm text-muted-foreground">{(field.value ?? '').length} | {(field.value ?? '').length > 70 ? 2 : 1} เครดิต</span>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <div className="w-full flex justify-end">
                                <Button>
                                    บันทึก
                                </Button>
                            </div>
                        </Card>
                    </form>
                </Form>
            </div>

            <AlertDialog open={hasBadWord} onOpenChange={setHasBadWord}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>มีแสปม</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="flex flex-col gap-4">
                                <span>คำแหล่านี้ถือเป็นสแปม</span>
                                <div className="flex gap-2 flex-wrap">
                                    {detectdBadWord.map((word: string, key: number) => (
                                        <span key={key}>{word}</span>
                                    ))}
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction>แก้ไข</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </AppLayout >
    );
}
