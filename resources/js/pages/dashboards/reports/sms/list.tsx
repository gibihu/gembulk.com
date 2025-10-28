import AppLayout from "@/layouts/app-layout";
import dash from "@/routes/dash";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { useEffect } from "react";

import * as React from "react";

import { ReportType } from "@/types/user";
import ReportTable from "../table";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'ส่งแล้ว',
        href: dash.report.sms().url,
    },
];

export default function SmsListPage(request: any) {
    const [items, setItems] = React.useState<ReportType[]>(request.reports as ReportType[]);

    useEffect(() => {
        console.log(request);
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <ReportTable items={items} />
            </div>
        </AppLayout>
    );
}
