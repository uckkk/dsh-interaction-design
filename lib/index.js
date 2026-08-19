// dsh-interaction-design — 交互设计理论（DeepSeek Harness）。纯 Node 知识库。
import { defineTool } from "@deepseek-ai/dsh-tools";

const name = "交互设计理论";
const inject = ["tools"];

const THEORIES = [
  { id: "fitts-law", name: "菲茨定律", en: "Fitts's Law", desc: "目标越大、距离越近，点击越快越准。交互元素应做大、放近、放在易达区域（如拇指热区）。", examples: ["按钮做够大", "高频操作放屏幕底部拇指区", "右键菜单贴近光标"] },
  { id: "hicks-law", name: "希克定律", en: "Hick's Law", desc: "选项越多，决策时间越长。应减少选项、分组、分层，降低认知负担。", examples: ["导航分组合并", "表单分步而非一次展示", "默认推荐减少选择"] },
  { id: "millers-law", name: "米勒定律", en: "Miller's Law", desc: "人类工作记忆约 7±2 个组块。信息分组（chunking）帮助记忆与理解。", examples: ["电话号码 3-4-4 分组", "菜单每组 ≤7 项", "表单字段分组"] },
  { id: "gestalt", name: "格式塔原理", en: "Gestalt Principles", desc: "人脑倾向把视觉元素按接近、相似、连续、闭合、共同命运组织成整体。用于信息分组与层级。", examples: ["相近元素视为一组", "同色同形视为一类", "对齐营造秩序"] },
  { id: "nielsen-heuristics", name: "尼尔森可用性十原则", en: "Nielsen's 10 Usability Heuristics", desc: "系统状态可见、贴近真实世界、用户控制与自由、一致性、防错、再认而非回忆、灵活高效、简约、帮助识别诊断错误、帮助文档。", examples: ["加载/操作给出反馈", "撤销操作", "错误提示说清原因与解决"] },
  { id: "jakobs-law", name: "雅各布定律", en: "Jakob's Law", desc: "用户把对其他产品的既有心智模型带到你的产品，遵循用户已熟悉的模式降低学习成本。", examples: ["购物车图标通用", "搜索框位置统一", "表单样式符合习惯"] },
  { id: "doherty-threshold", name: "多尔蒂阈值", en: "Doherty Threshold", desc: "系统响应时间 <400ms 时，用户工作效率最高。快速反馈提升流畅感。", examples: ["操作即时反馈", "骨架屏减少等待焦虑", "乐观更新"] },
  { id: "peak-end", name: "峰终定律", en: "Peak-End Rule", desc: "用户对体验的评价主要取决于峰值时刻与结束时刻，而非全程平均。", examples: ["关键节点制造惊喜", "结束页做得精致", "下单成功页体验"] },
  { id: "aesthetic-usability", name: "美即好用效应", en: "Aesthetic-Usability Effect", desc: "用户觉得美观的界面更易用，即使实际相同。美观能容忍小的可用性问题。", examples: ["视觉精致提升好感", "统一设计语言", "细节打磨"] },
  { id: "progressive-disclosure", name: "渐进式呈现", en: "Progressive Disclosure", desc: "先展示核心信息，按需展示更多，避免一次信息过载。", examples: ["高级设置折叠", "展开更多", "分步引导"] },
];

async function apply(ctx, _config) {
  ctx.tools.register(defineTool({
    name: "list_interaction_theories",
    description: "列出主流交互设计理论/定律（菲茨定律、希克定律、格式塔、尼尔森十原则等，中文名 + 概述）。用于产品/UI/交互设计时查阅。",
    parameters: {},
    output: {
      schema: {
        type: "object", additionalProperties: false,
        properties: {
          count: { type: "integer", required: true },
          theories: {
            type: "array", required: true,
            items: { type: "object", additionalProperties: false, properties: { id: { type: "string", required: true }, name: { type: "string", required: true }, en: { type: "string", required: true }, desc: { type: "string", required: true } } },
          },
        },
      },
      render: (_a, v) => [{ type: "text", text: v.theories.map((t) => `- ${t.name}（${t.en}）：${t.desc}`).join("\n") }],
    },
    execute: async () => ({ count: THEORIES.length, theories: THEORIES.map(({ id, name, en, desc }) => ({ id, name, en, desc })) }),
  }));

  ctx.tools.register(defineTool({
    name: "get_interaction_theory",
    description: "查询某条交互设计理论的详细说明与示例。`id` 传理论 id（如 fitts-law、nielsen-heuristics）或名称子串。",
    parameters: { id: { type: "string", required: true, description: "理论 id 或名称子串。" } },
    output: {
      schema: {
        type: "object", additionalProperties: false,
        properties: {
          name: { type: "string", required: true }, en: { type: "string", required: true },
          desc: { type: "string", required: true }, examples: { type: "array", required: true, items: { type: "string" } },
        },
      },
      render: (_a, v) => [{ type: "text", text: `【${v.name}】${v.en}\n${v.desc}\n示例：\n${v.examples.map((e) => "  - " + e).join("\n")}` }],
    },
    execute: async (args) => {
      const q = String(args.id).toLowerCase();
      const t = THEORIES.find((x) => x.id === q || x.name.includes(args.id) || x.en.toLowerCase().includes(q));
      if (!t) throw new Error(`未找到理论：${args.id}`);
      return { name: t.name, en: t.en, desc: t.desc, examples: t.examples };
    },
  }));
}

export { apply, inject, name };
