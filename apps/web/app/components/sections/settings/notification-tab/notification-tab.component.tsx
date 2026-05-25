"use client";

import { useState } from "react";
import { Card, Button, useAlertDialog } from "@/app/components";
import {
  useGenerateCodeMutation,
  useGetBaleStatusQuery,
  useDisconnectBaleMutation,
} from "@/app/services/bale";
import { Copy, Check, Link2, Unlink, Link } from "lucide-react";
import { useConfirm } from "@/app/lib/store/context";

export const NotificationsTab = () => {
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { showAlert } = useAlertDialog();
  const { confirm } = useConfirm();

  const { data: statusData, refetch: refetchStatus } = useGetBaleStatusQuery();
  const [generateCode, { isLoading: isGenerating }] = useGenerateCodeMutation();
  const [disconnect, { isLoading: isDisconnecting }] =
    useDisconnectBaleMutation();

  const isConnected = statusData?.isConnected || false;

  const handleGenerateCode = async () => {
    try {
      const result = await generateCode().unwrap();
      setGeneratedCode(result.code);
      setExpiresAt(result.expiresAt);
    } catch (error) {
      console.error(error);
      showAlert({
        variant: "error",
        title: "خطا در تولید کد",
        message: "مشکلی در تولید کد به وجود آمده است لطفا مجدد تلاش کنید",
      });
    }
  };

  const handleDisconnect = async () => {
    const isConfirmed = await confirm({
      variant: "danger",
      title: "قطع ربات",
      description: "آیا از قطع اتصال ربات بله اطمینان دارید؟",
    });
    if (isConfirmed) {
      await disconnect().unwrap();
      refetchStatus();
      setGeneratedCode(null);
    }
  };

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getRemainingSeconds = () => {
    if (!expiresAt) return 0;
    const remaining = new Date(expiresAt).getTime() - new Date().getTime();
    return Math.max(0, Math.floor(remaining / 1000));
  };

  return (
    <div className="space-y-6 w-full">
      <Card>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          اتصال به ربات بله
          <a href="https://ble.ir/keyboombot" target="_blank">
            <Link size={12} />
          </a>
        </h3>

        {!isConnected ? (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              برای اتصال، کد زیر را در ربات بله ارسال کنید:
            </p>

            {!generatedCode ? (
              <Button
                onClick={handleGenerateCode}
                loading={isGenerating}
                className="w-full"
              >
                <Link2 size={16} className="ml-2" />
                دریافت کد اتصال
              </Button>
            ) : (
              <div className="bg-gray-900 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-400 mb-2">کد اتصال شما:</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl font-mono font-bold text-indigo-400 tracking-wider">
                    {generatedCode}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    {copied ? (
                      <Check size={18} className="text-green-400" />
                    ) : (
                      <Copy size={18} className="text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  این کد تا {Math.floor(getRemainingSeconds() / 60)} دقیقه و{" "}
                  {getRemainingSeconds() % 60} ثانیه دیگر اعتبار دارد
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  کد را در ربات بله با فرمت{" "}
                  <span className="text-indigo-400">/code {generatedCode}</span>{" "}
                  ارسال کنید
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  تا زمان تایید احراز هویت، صفحه را رفرش نکنید
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-400">
                <Check size={16} />
                <span className="text-sm">ربات بله متصل است</span>
              </div>
            </div>

            <Button
              variant="danger"
              onClick={handleDisconnect}
              loading={isDisconnecting}
            >
              <Unlink size={16} className="ml-2" />
              قطع اتصال ربات بله
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
