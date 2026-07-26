"use client";

import { useState, useMemo } from "react";
import {
    App,
    Modal,
    Button,
    Input,
    Tooltip,
    Form,
    Popconfirm,
    ConfigProvider,
    Switch,
    InputNumber,
} from "antd";
import {
    Shield,
    Plus,
    Edit3,
    Trash2,
    Check,
    DollarSign,
    Star,
    Layers,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

// Plan Tier Data Structure
export interface PlanTierType {
    id: string;
    name: string;
    monthlyPrice: number;
    annualPrice: number;
    description: string;
    features: string[];
    isPopular?: boolean;
    connectedLimit: number;
    aiPostsLimit: number;
    badgeColor: string;
}

// Initial Mock Subscription Plans
const INITIAL_PLANS: PlanTierType[] = [
    {
        id: "plan-starter",
        name: "Starter Free",
        monthlyPrice: 0,
        annualPrice: 0,
        description: "Essential suite for solo creators getting started with social tracking.",
        features: [
            "Up to 3 Connected Channels",
            "50 AI Post Drafts / month",
            "Basic Analytics Dashboard",
            "Community Support",
            "Standard API Access",
        ],
        connectedLimit: 3,
        aiPostsLimit: 50,
        badgeColor: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    },
    {
        id: "plan-creator",
        name: "Creator Plus",
        monthlyPrice: 29,
        annualPrice: 290,
        description: "Power tools for growing creators managing multi-platform brands.",
        features: [
            "Up to 10 Connected Channels",
            "500 AI Post Drafts / month",
            "Advanced Post Scheduling",
            "Priority Email Support",
            "Team Access (2 Seats)",
            "Custom Branded Links",
        ],
        isPopular: true,
        connectedLimit: 10,
        aiPostsLimit: 500,
        badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    },
    {
        id: "plan-enterprise",
        name: "Enterprise Pro",
        monthlyPrice: 199,
        annualPrice: 1990,
        description: "Full-scale solution for agencies, media groups & enterprise teams.",
        features: [
            "Unlimited Connected Channels",
            "5,000 AI Post Drafts / month",
            "Real-time Telemetry & SLA",
            "Dedicated Account Manager",
            "Unlimited Team Seats",
            "Audit Compliance Logs",
        ],
        connectedLimit: 999,
        aiPostsLimit: 5000,
        badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
        id: "plan-agency",
        name: "Agency Custom",
        monthlyPrice: 499,
        annualPrice: 4990,
        description: "Tailored infrastructure for high-volume enterprise networks.",
        features: [
            "Custom API Rate Limits",
            "White-label Portal",
            "Dedicated IP & Vault",
            "24/7 Phone & Slack Support",
            "Custom AI Model Fine-tuning",
            "Custom Contract Guarantees",
        ],
        connectedLimit: 9999,
        aiPostsLimit: 25000,
        badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
];

function SubscriptionsContent() {
    const { message } = App.useApp();

    // State Management
    const [plans, setPlans] = useState<PlanTierType[]>(INITIAL_PLANS);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<PlanTierType | null>(null);

    // Expandable card features state
    const [expandedPlanIds, setExpandedPlanIds] = useState<Record<string, boolean>>({});

    // Dynamic Features state for Create & Edit Modals
    const [createFeatures, setCreateFeatures] = useState<string[]>([
        "Up to 5 Connected Channels",
        "300 AI Post Drafts / month",
        "24/7 Priority Support",
    ]);
    const [createFeatureInput, setCreateFeatureInput] = useState("");

    const [editFeatures, setEditFeatures] = useState<string[]>([]);
    const [editFeatureInput, setEditFeatureInput] = useState("");

    // Form instances
    const [createForm] = Form.useForm();
    const [editForm] = Form.useForm();

    // Calculated Statistics
    const stats = useMemo(() => {
        const totalPlans = plans.length;
        const popularPlan = plans.find((p) => p.isPopular)?.name || "None";
        const avgMonthlyPrice = Math.round(
            plans.reduce((acc, curr) => acc + curr.monthlyPrice, 0) / (totalPlans || 1)
        );

        return {
            totalPlans,
            popularPlan,
            avgMonthlyPrice: `$${avgMonthlyPrice}`,
        };
    }, [plans]);

    // Feature Handlers for Create Modal
    const handleAddCreateFeature = () => {
        if (!createFeatureInput.trim()) return;
        setCreateFeatures([...createFeatures, createFeatureInput.trim()]);
        setCreateFeatureInput("");
    };

    const handleRemoveCreateFeature = (index: number) => {
        setCreateFeatures(createFeatures.filter((_, i) => i !== index));
    };

    // Feature Handlers for Edit Modal
    const handleAddEditFeature = () => {
        if (!editFeatureInput.trim()) return;
        setEditFeatures([...editFeatures, editFeatureInput.trim()]);
        setEditFeatureInput("");
    };

    const handleRemoveEditFeature = (index: number) => {
        setEditFeatures(editFeatures.filter((_, i) => i !== index));
    };

    // Handle Create New Plan Submit
    const handleCreatePlan = (values: any) => {
        const newPlan: PlanTierType = {
            id: `plan-${Date.now()}`,
            name: values.name,
            monthlyPrice: Number(values.monthlyPrice) || 0,
            annualPrice: Number(values.annualPrice) || 0,
            description: values.description || "Custom subscription plan tier.",
            features: createFeatures.length > 0 ? createFeatures : ["Full Platform Access"],
            isPopular: values.isPopular || false,
            connectedLimit: Number(values.connectedLimit) || 5,
            aiPostsLimit: Number(values.aiPostsLimit) || 500,
            badgeColor: "bg-primary/10 text-primary border-primary/20",
        };

        let updatedPlans = [...plans];
        if (newPlan.isPopular) {
            updatedPlans = updatedPlans.map((p) => ({ ...p, isPopular: false }));
        }

        setPlans([newPlan, ...updatedPlans]);
        message.success(`Subscription Plan "${newPlan.name}" created successfully!`);
        setIsCreateModalOpen(false);
        createForm.resetFields();
        setCreateFeatures(["Up to 5 Connected Channels", "300 AI Post Drafts / month"]);
    };

    // Open Edit Plan Modal
    const handleOpenEdit = (plan: PlanTierType) => {
        setSelectedPlanForEdit(plan);
        setEditFeatures([...plan.features]);
        setEditFeatureInput("");
        editForm.setFieldsValue({
            name: plan.name,
            monthlyPrice: plan.monthlyPrice,
            annualPrice: plan.annualPrice,
            description: plan.description,
            connectedLimit: plan.connectedLimit,
            aiPostsLimit: plan.aiPostsLimit,
            isPopular: plan.isPopular || false,
        });
        setIsEditModalOpen(true);
    };

    // Handle Edit Plan Submit
    const handleEditPlanSubmit = (values: any) => {
        if (!selectedPlanForEdit) return;

        const isNowPopular = values.isPopular || false;

        setPlans((prevPlans) =>
            prevPlans.map((p) => {
                if (p.id === selectedPlanForEdit.id) {
                    return {
                        ...p,
                        name: values.name,
                        monthlyPrice: Number(values.monthlyPrice),
                        annualPrice: Number(values.annualPrice),
                        description: values.description,
                        connectedLimit: Number(values.connectedLimit),
                        aiPostsLimit: Number(values.aiPostsLimit),
                        isPopular: isNowPopular,
                        features: editFeatures.length > 0 ? editFeatures : p.features,
                    };
                }
                return isNowPopular ? { ...p, isPopular: false } : p;
            })
        );

        message.success(`Plan Tier "${values.name}" updated successfully!`);
        setIsEditModalOpen(false);
        setSelectedPlanForEdit(null);
    };

    // Handle Delete Plan
    const handleDeletePlan = (planId: string, planName: string) => {
        setPlans((prev) => prev.filter((p) => p.id !== planId));
        message.success(`Plan "${planName}" deleted successfully`);
    };

    // Toggle Popular Tag directly on card
    const handleTogglePopular = (planId: string) => {
        setPlans((prev) =>
            prev.map((p) => ({
                ...p,
                isPopular: p.id === planId ? !p.isPopular : false,
            }))
        );
        message.info("Popular plan badge updated");
    };

    // Toggle features card expansion
    const toggleExpandCard = (planId: string) => {
        setExpandedPlanIds((prev) => ({ ...prev, [planId]: !prev[planId] }));
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-300">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-4 border-b border-gray-200 dark:border-zinc-800">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                            Subscription Plans & Pricing
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">
                        Configure subscription packages, set pricing models, manage features, and allocate limits.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    {/* Billing Cycle Switcher Toggle */}
                    <div className="flex items-center gap-1.5 bg-muted/60 p-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 text-xs">
                        <button
                            onClick={() => setBillingCycle("monthly")}
                            className={`cursor-pointer px-3 py-1.5 rounded-lg font-bold transition-all ${billingCycle === "monthly"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Monthly Billing
                        </button>
                        <button
                            onClick={() => setBillingCycle("annual")}
                            className={`cursor-pointer px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${billingCycle === "annual"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <span>Annual (Save 20%)</span>
                        </button>
                    </div>

                    <Button
                        type="primary"
                        icon={<Plus className="w-4 h-4" />}
                        onClick={() => setIsCreateModalOpen(true)}
                        className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground border-none font-semibold h-10 px-4 sm:px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 text-xs sm:text-sm"
                    >
                        Create New Plan
                    </Button>
                </div>
            </div>

            {/* Top Stat Overview Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                <div className="bg-card border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:border-primary/40 transition-all flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                            ACTIVE PLAN TIERS
                        </p>
                        <h4 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-1">
                            {stats.totalPlans} Tiers
                        </h4>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                        <Layers className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-card border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:border-amber-500/40 transition-all flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                            FEATURED HIGHLIGHT
                        </p>
                        <h4 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-1">
                            {stats.popularPlan}
                        </h4>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    </div>
                </div>

                <div className="bg-card border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:border-secondary/40 transition-all flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                            AVERAGE TIER PRICE
                        </p>
                        <h4 className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-1">
                            {stats.avgMonthlyPrice} /mo
                        </h4>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-secondary/80 text-secondary-foreground border border-border flex items-center justify-center shrink-0">
                        <DollarSign className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Subscription Plans Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Available Subscription Tiers
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan) => {
                        const price = billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;
                        const cycleLabel = billingCycle === "annual" ? "/ year" : "/ month";
                        const isExpanded = !!expandedPlanIds[plan.id];
                        const visibleFeatures = isExpanded ? plan.features : plan.features.slice(0, 4);

                        return (
                            <div
                                key={plan.id}
                                className={`relative bg-card border rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${plan.isPopular
                                    ? "border-primary/60 shadow-lg shadow-primary/5 ring-1 ring-primary/30"
                                    : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"
                                    }`}
                            >
                                {plan.isPopular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground font-extrabold text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-primary-foreground text-primary-foreground" />
                                        <span>MOST POPULAR</span>
                                    </div>
                                )}

                                <div>
                                    {/* Plan Title & Actions */}
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="text-xl font-extrabold text-foreground">{plan.name}</h3>

                                        <div className="flex items-center gap-1">
                                            <Tooltip title="Edit Plan">
                                                <button
                                                    onClick={() => handleOpenEdit(plan)}
                                                    className="cursor-pointer p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                            </Tooltip>

                                            <Popconfirm
                                                title="Delete Plan Tier?"
                                                description="Are you sure you want to remove this subscription plan?"
                                                onConfirm={() => handleDeletePlan(plan.id, plan.name)}
                                                okText="Yes, Delete"
                                                cancelText="Cancel"
                                                okButtonProps={{ danger: true }}
                                            >
                                                <button className="cursor-pointer p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-muted/80 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </Popconfirm>
                                        </div>
                                    </div>

                                    <p className="text-xs text-muted-foreground leading-relaxed font-medium min-h-[36px]">
                                        {plan.description}
                                    </p>

                                    {/* Price Display */}
                                    <div className="mt-4 mb-5">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3.5xl md:text-4xl font-black text-foreground">
                                                ${price}
                                            </span>
                                            <span className="text-xs font-semibold text-muted-foreground">
                                                {cycleLabel}
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-muted-foreground font-medium block mt-1">
                                            {billingCycle === "annual"
                                                ? `Billed annually ($${Math.round(price / 12)}/mo equivalent)`
                                                : `Or $${plan.annualPrice}/yr billed annually`}
                                        </span>
                                    </div>

                                    {/* Limits Info Box */}
                                    <div className="bg-muted/40 border border-gray-200 dark:border-zinc-800 p-3 rounded-2xl space-y-1.5 mb-4 text-xs">
                                        <div className="flex justify-between font-semibold">
                                            <span className="text-muted-foreground">Channels Allowed:</span>
                                            <span className="text-foreground font-extrabold">
                                                {plan.connectedLimit >= 999 ? "Unlimited" : `${plan.connectedLimit} channels`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between font-semibold">
                                            <span className="text-muted-foreground">AI Drafts Quota:</span>
                                            <span className="text-foreground font-extrabold">
                                                {plan.aiPostsLimit.toLocaleString()} / mo
                                            </span>
                                        </div>
                                    </div>

                                    <div className="h-[1px] w-full bg-gray-100 dark:bg-zinc-800 my-4" />

                                    {/* Features Checklist */}
                                    <div className="space-y-2.5">
                                        {visibleFeatures.map((feat, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-xs font-medium text-foreground">
                                                <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                                                <span>{feat}</span>
                                            </div>
                                        ))}

                                        {plan.features.length > 4 && (
                                            <button
                                                onClick={() => toggleExpandCard(plan.id)}
                                                className="cursor-pointer mt-2 text-[11px] font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                                            >
                                                {isExpanded ? (
                                                    <>
                                                        <span>Show Less</span>
                                                        <ChevronUp className="w-3 h-3" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>+ {plan.features.length - 4} More Features</span>
                                                        <ChevronDown className="w-3 h-3" />
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Card Footer Actions */}
                                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                                    <button
                                        onClick={() => handleTogglePopular(plan.id)}
                                        className="cursor-pointer text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                                    >
                                        <Star className={`w-3.5 h-3.5 ${plan.isPopular ? "fill-amber-500 text-amber-500" : ""}`} />
                                        <span>{plan.isPopular ? "Featured" : "Set Popular"}</span>
                                    </button>

                                    <Button
                                        type="primary"
                                        size="small"
                                        icon={<Edit3 className="w-3.5 h-3.5" />}
                                        onClick={() => handleOpenEdit(plan)}
                                        className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground border-none rounded-xl text-xs font-semibold"
                                    >
                                        Edit Tier
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Create Plan Modal (Fully Responsive for All Devices) */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-foreground pb-2 border-b border-gray-200 dark:border-zinc-800">
                        <Plus className="w-5 h-5 text-primary" />
                        <span>Create Subscription Plan</span>
                    </div>
                }
                open={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
                footer={null}
                width="92%"
                style={{ maxWidth: 580 }}
                centered
                className="responsive-modal"
            >
                <div className="max-h-[75vh] overflow-y-auto pr-1">
                    <Form
                        form={createForm}
                        layout="vertical"
                        onFinish={handleCreatePlan}
                        initialValues={{
                            monthlyPrice: 49,
                            annualPrice: 490,
                            connectedLimit: 15,
                            aiPostsLimit: 1000,
                            isPopular: false,
                        }}
                        className="mt-3 space-y-4"
                    >
                        <Form.Item
                            name="name"
                            label={<span className="font-semibold text-foreground text-xs sm:text-sm">Plan Name</span>}
                            rules={[{ required: true, message: "Please enter plan name" }]}
                        >
                            <Input placeholder="e.g. Agency Growth" className="rounded-xl h-10 border-gray-200 dark:border-zinc-800 text-xs sm:text-sm" />
                        </Form.Item>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <Form.Item
                                name="monthlyPrice"
                                label={<span className="font-semibold text-foreground text-xs sm:text-sm">Monthly Price ($)</span>}
                                rules={[{ required: true, message: "Monthly price required" }]}
                            >
                                <InputNumber min={0} className="w-full rounded-xl h-10 border-gray-200 dark:border-zinc-800 text-xs sm:text-sm" />
                            </Form.Item>

                            <Form.Item
                                name="annualPrice"
                                label={<span className="font-semibold text-foreground text-xs sm:text-sm">Annual Price ($)</span>}
                                rules={[{ required: true, message: "Annual price required" }]}
                            >
                                <InputNumber min={0} className="w-full rounded-xl h-10 border-gray-200 dark:border-zinc-800 text-xs sm:text-sm" />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <Form.Item
                                name="connectedLimit"
                                label={<span className="font-semibold text-foreground text-xs sm:text-sm">Channels Limit</span>}
                            >
                                <InputNumber min={1} className="w-full rounded-xl h-10 border-gray-200 dark:border-zinc-800 text-xs sm:text-sm" />
                            </Form.Item>

                            <Form.Item
                                name="aiPostsLimit"
                                label={<span className="font-semibold text-foreground text-xs sm:text-sm">AI Drafts Quota / mo</span>}
                            >
                                <InputNumber min={10} className="w-full rounded-xl h-10 border-gray-200 dark:border-zinc-800 text-xs sm:text-sm" />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="description"
                            label={<span className="font-semibold text-foreground text-xs sm:text-sm">Description</span>}
                        >
                            <Input.TextArea
                                rows={2}
                                placeholder="Target audience or purpose of this pricing tier..."
                                className="rounded-xl border-gray-200 dark:border-zinc-800 text-xs sm:text-sm"
                            />
                        </Form.Item>

                        {/* Interactive Feature List Manager */}
                        <div className="space-y-3 pt-1">
                            <label className="font-semibold text-foreground text-xs sm:text-sm block">
                                Plan Features Checklist
                            </label>

                            {/* Add Feature Input Field & Plus Button */}
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="e.g. 24/7 Phone & Slack Support"
                                    value={createFeatureInput}
                                    onChange={(e) => setCreateFeatureInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleAddCreateFeature();
                                        }
                                    }}
                                    className="rounded-xl h-10 border-gray-200 dark:border-zinc-800 text-xs sm:text-sm flex-1"
                                />
                                <Button
                                    type="primary"
                                    onClick={handleAddCreateFeature}
                                    icon={<Plus className="w-4 h-4" />}
                                    className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground border-none rounded-xl h-10 px-4 flex items-center gap-1 font-semibold text-xs shrink-0"
                                >
                                    Add
                                </Button>
                            </div>

                            {/* Features List with Checkmark and Delete/Trash icons */}
                            <div className="space-y-2">
                                {createFeatures.map((feat, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-gray-200 dark:border-zinc-800 text-xs font-semibold text-foreground"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                            <Check className="w-4 h-4 text-primary shrink-0" />
                                            <span className="truncate">{feat}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveCreateFeature(idx)}
                                            className="cursor-pointer p-1 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
                                            title="Delete Feature"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}

                                {createFeatures.length === 0 && (
                                    <p className="text-xs text-muted-foreground italic text-center py-2">
                                        No features added yet. Use the field above to add features.
                                    </p>
                                )}
                            </div>
                        </div>

                        <Form.Item
                            name="isPopular"
                            valuePropName="checked"
                            label={<span className="font-semibold text-foreground text-xs sm:text-sm">Mark as Most Popular Tier</span>}
                            className="pt-2"
                        >
                            <Switch />
                        </Form.Item>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
                            <Button onClick={() => setIsCreateModalOpen(false)} className="cursor-pointer rounded-xl text-xs sm:text-sm">
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground border-none rounded-xl px-6 font-semibold text-xs sm:text-sm"
                            >
                                Deploy Plan Tier
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>

            {/* Edit Plan Modal (Fully Responsive for All Devices) */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-foreground pb-2 border-b border-gray-200 dark:border-zinc-800">
                        <Edit3 className="w-5 h-5 text-primary" />
                        <span>Edit Pricing Tier</span>
                    </div>
                }
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
                width="92%"
                style={{ maxWidth: 580 }}
                centered
                className="responsive-modal"
            >
                <div className="max-h-[75vh] overflow-y-auto pr-1">
                    <Form
                        form={editForm}
                        layout="vertical"
                        onFinish={handleEditPlanSubmit}
                        className="mt-3 space-y-4"
                    >
                        <Form.Item
                            name="name"
                            label={<span className="font-semibold text-foreground text-xs sm:text-sm">Plan Name</span>}
                            rules={[{ required: true }]}
                        >
                            <Input className="rounded-xl h-10 border-gray-200 dark:border-zinc-800 text-xs sm:text-sm" />
                        </Form.Item>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <Form.Item
                                name="monthlyPrice"
                                label={<span className="font-semibold text-foreground text-xs sm:text-sm">Monthly Price ($)</span>}
                                rules={[{ required: true }]}
                            >
                                <InputNumber min={0} className="w-full rounded-xl h-10 border-gray-200 dark:border-zinc-800 text-xs sm:text-sm" />
                            </Form.Item>

                            <Form.Item
                                name="annualPrice"
                                label={<span className="font-semibold text-foreground text-xs sm:text-sm">Annual Price ($)</span>}
                                rules={[{ required: true }]}
                            >
                                <InputNumber min={0} className="w-full rounded-xl h-10 border-gray-200 dark:border-zinc-800 text-xs sm:text-sm" />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <Form.Item
                                name="connectedLimit"
                                label={<span className="font-semibold text-foreground text-xs sm:text-sm">Channels Limit</span>}
                            >
                                <InputNumber min={1} className="w-full rounded-xl h-10 border-gray-200 dark:border-zinc-800 text-xs sm:text-sm" />
                            </Form.Item>

                            <Form.Item
                                name="aiPostsLimit"
                                label={<span className="font-semibold text-foreground text-xs sm:text-sm">AI Drafts Quota / mo</span>}
                            >
                                <InputNumber min={10} className="w-full rounded-xl h-10 border-gray-200 dark:border-zinc-800 text-xs sm:text-sm" />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="description"
                            label={<span className="font-semibold text-foreground text-xs sm:text-sm">Description</span>}
                        >
                            <Input.TextArea rows={2} className="rounded-xl border-gray-200 dark:border-zinc-800 text-xs sm:text-sm" />
                        </Form.Item>

                        {/* Interactive Feature List Manager for Edit */}
                        <div className="space-y-3 pt-1">
                            <label className="font-semibold text-foreground text-xs sm:text-sm block">
                                Edit Plan Features Checklist
                            </label>

                            {/* Add Feature Input Field & Plus Button */}
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="e.g. 24/7 Support Guaranteed"
                                    value={editFeatureInput}
                                    onChange={(e) => setEditFeatureInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleAddEditFeature();
                                        }
                                    }}
                                    className="rounded-xl h-10 border-gray-200 dark:border-zinc-800 text-xs sm:text-sm flex-1"
                                />
                                <Button
                                    type="primary"
                                    onClick={handleAddEditFeature}
                                    icon={<Plus className="w-4 h-4" />}
                                    className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground border-none rounded-xl h-10 px-4 flex items-center gap-1 font-semibold text-xs shrink-0"
                                >
                                    Add
                                </Button>
                            </div>

                            {/* Features List with Checkmark and Delete/Trash icons */}
                            <div className="space-y-2">
                                {editFeatures.map((feat, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-gray-200 dark:border-zinc-800 text-xs font-semibold text-foreground"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                            <Check className="w-4 h-4 text-primary shrink-0" />
                                            <span className="truncate">{feat}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveEditFeature(idx)}
                                            className="cursor-pointer p-1 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
                                            title="Delete Feature"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Form.Item
                            name="isPopular"
                            valuePropName="checked"
                            label={<span className="font-semibold text-foreground text-xs sm:text-sm">Mark as Most Popular Tier</span>}
                            className="pt-2"
                        >
                            <Switch />
                        </Form.Item>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
                            <Button onClick={() => setIsEditModalOpen(false)} className="cursor-pointer rounded-xl text-xs sm:text-sm">
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground border-none rounded-xl px-6 font-semibold text-xs sm:text-sm"
                            >
                                Save Plan Changes
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </div>
    );
}

export default function Subscriptions() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#10B981",
                    borderRadius: 12,
                },
            }}
        >
            <App>
                <SubscriptionsContent />
            </App>
        </ConfigProvider>
    );
}
