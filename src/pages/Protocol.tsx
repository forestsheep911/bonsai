import { useState } from "react";
import { CheckCircle2, FileJson2, Network, Send, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const manifestExample = `{
  "id": "prompt-shelf",
  "slug": "prompt-shelf",
  "name": "Prompt Shelf",
  "summary": "AI 提示词管理与复用工具",
  "status": "mature",
  "tags": ["AI", "工具"],
  "links": [
    {
      "type": "github",
      "label": "GitHub",
      "url": "https://github.com/example/prompt-shelf"
    }
  ],
  "metrics": [
    {
      "key": "users",
      "label": "活跃用户",
      "value": 1234,
      "unit": "人"
    }
  ],
  "milestones": [
    {
      "id": "launch-2026-05-01",
      "type": "launch",
      "title": "首次上线",
      "occurredAt": "2026-05-01T12:00:00Z"
    }
  ],
  "story": "项目故事写在这里。",
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-05-01T12:00:00Z",
  "visibility": "public"
}`;

const reportExample = `{
  "slug": "factory-soon",
  "status": "live",
  "metrics": [
    {
      "key": "users",
      "label": "活跃用户",
      "value": 1380
    },
    {
      "key": "stars",
      "label": "Stars",
      "value": 1602
    }
  ],
  "milestones": [
    {
      "id": "factory-soon-weekly-report-2026-05-02",
      "type": "review",
      "title": "CI 上报了新的周报快照",
      "description": "刷新用户数、Stars 和最近部署状态。",
      "occurredAt": "2026-05-02T08:00:00Z"
    }
  ],
  "buildStatus": "success",
  "deployStatus": "success",
  "reportedAt": "2026-05-02T08:05:00Z",
  "source": {
    "type": "ci",
    "name": "GitHub Actions"
  }
}`;

interface ValidationIssue {
  path: string;
  code: string;
  message: string;
}

interface ValidationState {
  status: "idle" | "checking" | "valid" | "invalid" | "error";
  message: string;
  issues: ValidationIssue[];
}

export function Protocol() {
  const [manifestText, setManifestText] = useState(manifestExample);
  const [reportText, setReportText] = useState(reportExample);
  const [validation, setValidation] = useState<ValidationState>({
    status: "idle",
    message: "等待校验",
    issues: [],
  });
  const [reportResult, setReportResult] = useState<ValidationState>({
    status: "idle",
    message: "等待上报",
    issues: [],
  });
  const [reportPreview, setReportPreview] = useState("");

  const validateManifest = async () => {
    setValidation({
      status: "checking",
      message: "正在校验 manifest...",
      issues: [],
    });

    let body: unknown;
    try {
      body = JSON.parse(manifestText);
    } catch {
      setValidation({
        status: "error",
        message: "JSON 格式无效，请先修正语法。",
        issues: [],
      });
      return;
    }

    try {
      const response = await fetch("/api/projects/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as {
        valid?: boolean;
        issues?: ValidationIssue[];
      };

      setValidation({
        status: payload.valid ? "valid" : "invalid",
        message: payload.valid
          ? "manifest 可以被 Bonsai 接收。"
          : "manifest 还不符合协议。",
        issues: payload.issues ?? [],
      });
    } catch {
      setValidation({
        status: "error",
        message: "当前开发环境没有可用的 Functions API。",
        issues: [],
      });
    }
  };

  const submitReport = async () => {
    setReportResult({
      status: "checking",
      message: "正在生成合并预览...",
      issues: [],
    });
    setReportPreview("");

    let body: unknown;
    try {
      body = JSON.parse(reportText);
    } catch {
      setReportResult({
        status: "error",
        message: "JSON 格式无效，请先修正语法。",
        issues: [],
      });
      return;
    }

    try {
      const response = await fetch("/api/projects/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as {
        valid?: boolean;
        issues?: ValidationIssue[];
        project?: unknown;
        error?: { message?: string };
      };

      if (!response.ok || !payload.valid) {
        setReportResult({
          status: response.status === 404 ? "error" : "invalid",
          message:
            payload.error?.message ??
            "report 还不能被 Bonsai 接收。",
          issues: payload.issues ?? [],
        });
        return;
      }

      setReportResult({
        status: "valid",
        message: "report 可以被接收，下面是合并预览。",
        issues: [],
      });
      setReportPreview(JSON.stringify(payload.project, null, 2));
    } catch {
      setReportResult({
        status: "error",
        message: "当前开发环境没有可用的 Functions API。",
        issues: [],
      });
    }
  };

  const statusIcon =
    validation.status === "valid" ? (
      <CheckCircle2 className="h-4 w-4 text-green-700" />
    ) : validation.status === "invalid" || validation.status === "error" ? (
      <XCircle className="h-4 w-4 text-red-700" />
    ) : (
      <FileJson2 className="h-4 w-4 text-muted-foreground" />
    );

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-12">
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div className="space-y-5">
          <Badge variant="outline" className="w-fit border-green-900/20 bg-green-900/5 text-green-800">
            Project Protocol v0
          </Badge>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              项目自己上报，Bonsai 负责聚合
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              每个项目维护自己的 `bonsai.json`，Bonsai 接收结构化事实，生成公开项目园、详情页和培育日志。
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Manifest", "项目基础事实"],
            ["Snapshot", "当前展示视图"],
            ["Timeline", "跨项目事件流"],
          ].map(([label, description]) => (
            <div key={label} className="rounded-lg border bg-card p-4">
              <div className="font-semibold">{label}</div>
              <div className="mt-1 text-sm text-muted-foreground">{description}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-green-700" />
            <h2 className="text-xl font-semibold">公开接口</h2>
          </div>
          <div className="divide-y rounded-lg border bg-card">
            {[
              ["GET", "/api/projects", "读取项目快照列表"],
              ["GET", "/api/projects/{slug}", "读取单个项目快照"],
              ["GET", "/api/timeline", "读取全站培育日志"],
              ["GET", "/api/projects/schema", "读取 manifest JSON Schema"],
              ["POST", "/api/projects/validate", "校验 bonsai.json"],
              ["POST", "/api/projects/report", "上报项目状态并返回合并预览"],
            ].map(([method, path, description]) => (
              <div key={path} className="grid gap-2 p-4 sm:grid-cols-[4rem_1fr]">
                <Badge variant="secondary" className="w-fit font-mono text-xs">
                  {method}
                </Badge>
                <div className="min-w-0">
                  <div className="break-all font-mono text-sm">{path}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">校验 bonsai.json</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                粘贴 manifest 后调用协议校验接口。
              </p>
            </div>
            <Button
              onClick={validateManifest}
              disabled={validation.status === "checking"}
              className="gap-2 bg-green-700 text-white hover:bg-green-800"
            >
              <Send className="h-4 w-4" />
              {validation.status === "checking" ? "校验中" : "校验"}
            </Button>
          </div>

          <Textarea
            value={manifestText}
            onChange={(event) => setManifestText(event.target.value)}
            className="min-h-[28rem] resize-y font-mono text-xs leading-5"
            spellCheck={false}
          />

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              {statusIcon}
              {validation.message}
            </div>
            {validation.issues.length > 0 && (
              <div className="mt-4 space-y-2">
                {validation.issues.map((issue) => (
                  <div
                    key={`${issue.path}-${issue.code}-${issue.message}`}
                    className="rounded-md border bg-muted/20 px-3 py-2 text-sm"
                  >
                    <div className="font-mono text-xs text-muted-foreground">
                      {issue.path} · {issue.code}
                    </div>
                    <div className="mt-1">{issue.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-green-700" />
            <h2 className="text-xl font-semibold">模拟 CI 上报</h2>
          </div>
          <div className="rounded-lg border bg-card p-5 text-sm leading-7 text-muted-foreground">
            <p>
              Report 是一次增量事件，通常由部署流程或项目脚本发送。当前接口只返回合并预览，不写入数据库。
            </p>
            <div className="mt-4 rounded-md bg-muted/30 p-3 font-mono text-xs text-foreground">
              POST /api/projects/report
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">上报 ProjectReport</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                发送状态、指标、链接或里程碑变化，查看合并后的 snapshot。
              </p>
            </div>
            <Button
              onClick={submitReport}
              disabled={reportResult.status === "checking"}
              className="gap-2 bg-green-700 text-white hover:bg-green-800"
            >
              <Send className="h-4 w-4" />
              {reportResult.status === "checking" ? "上报中" : "上报"}
            </Button>
          </div>

          <Textarea
            value={reportText}
            onChange={(event) => setReportText(event.target.value)}
            className="min-h-[24rem] resize-y font-mono text-xs leading-5"
            spellCheck={false}
          />

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              {reportResult.status === "valid" ? (
                <CheckCircle2 className="h-4 w-4 text-green-700" />
              ) : reportResult.status === "invalid" || reportResult.status === "error" ? (
                <XCircle className="h-4 w-4 text-red-700" />
              ) : (
                <FileJson2 className="h-4 w-4 text-muted-foreground" />
              )}
              {reportResult.message}
            </div>
            {reportResult.issues.length > 0 && (
              <div className="mt-4 space-y-2">
                {reportResult.issues.map((issue) => (
                  <div
                    key={`${issue.path}-${issue.code}-${issue.message}`}
                    className="rounded-md border bg-muted/20 px-3 py-2 text-sm"
                  >
                    <div className="font-mono text-xs text-muted-foreground">
                      {issue.path} · {issue.code}
                    </div>
                    <div className="mt-1">{issue.message}</div>
                  </div>
                ))}
              </div>
            )}
            {reportPreview && (
              <pre className="mt-4 max-h-96 overflow-auto rounded-md bg-muted/30 p-3 text-xs leading-5">
                {reportPreview}
              </pre>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
