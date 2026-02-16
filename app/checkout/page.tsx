"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrderTypeToggle } from "@/components/checkout/order-type-toggle";
import { DineInSection } from "@/components/checkout/dine-in-section";
import { PickupSection } from "@/components/checkout/pickup-section";
import { YourDetailsSection } from "@/components/checkout/your-details-section";
import { OrderSummarySection } from "@/components/checkout/order-summary-section";
import { TipSection } from "@/components/checkout/tip-section";
import { PaymentMethodSection } from "@/components/checkout/payment-method-section";
import { TotalsSection } from "@/components/checkout/totals-section";
import { PlaceOrderButton } from "@/components/checkout/place-order-button";

type OrderType = "dine-in" | "pickup";
type TipOption = "none" | "10" | "15" | "20" | "custom";

const restaurant = {
  name: "Pizza Palace",
  address: "123 Main Street, Brussels",
  distance: "1.2 km",
  tippingEnabled: true,
};

const orderSummary = {
  items: [
    { 
      quantity: 1, 
      name: "Margherita", 
      variant: "Medium", 
      price: 16.5,
      selectedOptions: {
        "toppings": ["mushrooms", "olives"]
      },
      specialInstructions: "Extra crispy please"
    },
    { 
      quantity: 2, 
      name: "Pepperoni", 
      variant: "Large", 
      price: 38.0,
      selectedOptions: {
        "toppings": ["extra-cheese"]
      },
      sauceQuantities: {
        "garlic-sauce": 2
      }
    },
    { quantity: 1, name: "Coca-Cola", variant: null, price: 3.5 },
  ],
  itemCount: 3,
  subtotal: 58.0,
  tax: 5.8,
};

const scheduleDays = [
  { label: "Today", date: "Jan 25", value: "2026-01-25" },
  { label: "Sat", date: "Jan 26", value: "2026-01-26" },
  { label: "Sun", date: "Jan 27", value: "2026-01-27" },
  { label: "Mon", date: "Jan 28", value: "2026-01-28" },
  { label: "Tue", date: "Jan 29", value: "2026-01-29" },
];

const timeSlots = [
  "11:00 - 11:30",
  "11:15 - 11:45",
  "11:30 - 12:00",
  "11:45 - 12:15",
  "12:00 - 12:30",
  "12:15 - 12:45",
  "12:30 - 13:00",
  "12:45 - 13:15",
  "13:00 - 13:30",
];

export default function CheckoutPage() {
  const router = useRouter();
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [tableNumber, setTableNumber] = useState("5");
  const [pickupTimeMode, setPickupTimeMode] = useState<"standard" | "schedule">(
    "standard"
  );
  const [selectedDay, setSelectedDay] = useState(scheduleDays[0].value);
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [tipOption, setTipOption] = useState<TipOption>("none");
  const [customTip, setCustomTip] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("pay-now");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saveDetails, setSaveDetails] = useState(false);

  let tipAmount = 0;
  if (tipOption === "10") tipAmount = orderSummary.subtotal * 0.1;
  else if (tipOption === "15") tipAmount = orderSummary.subtotal * 0.15;
  else if (tipOption === "20") tipAmount = orderSummary.subtotal * 0.2;
  else if (tipOption === "custom" && customTip) tipAmount = parseFloat(customTip);

  const total = orderSummary.subtotal + orderSummary.tax + tipAmount;

  const isFormComplete =
    orderType === "dine-in" || Boolean(name.trim() && phone.trim());

  return (
    <div className="min-h-screen bg-background pb-24 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-foreground font-serif">Checkout</h1>
          <div className="w-6" />
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-6 pb-0">
        {/* Order Type Toggle */}
        <OrderTypeToggle
          value={orderType}
          onChange={(type) => {
            setOrderType(type);
            setPaymentMethod("pay-now");
          }}
        />

        {/* Order Type Details */}
        {orderType === "dine-in" ? (
          <DineInSection
            tableNumber={tableNumber}
            isEditing={false}
            onEdit={() => {}}
            onSave={(newTable) => {
              setTableNumber(newTable);
            }}
            onCancel={() => {}}
          />
        ) : (
          <PickupSection
            restaurant={restaurant}
            timeMode={pickupTimeMode}
            selectedDay={selectedDay}
            selectedTime={selectedTime}
            onTimeChange={() => {
              setPickupTimeMode(
                pickupTimeMode === "standard" ? "schedule" : "standard"
              );
            }}
            onScheduleClick={() => setIsScheduleOpen(true)}
            days={scheduleDays}
            onDayChange={setSelectedDay}
            onTimeSelect={setSelectedTime}
            timeSlots={timeSlots}
            isScheduleOpen={isScheduleOpen}
            onScheduleClose={() => setIsScheduleOpen(false)}
          />
        )}

        {/* Your Details (Pickup Only) */}
        {orderType === "pickup" && (
          <YourDetailsSection
            name={name}
            phone={phone}
            email={email}
            saveDetails={saveDetails}
            onNameChange={setName}
            onPhoneChange={setPhone}
            onEmailChange={setEmail}
            onSaveDetailsChange={setSaveDetails}
          />
        )}

        {/* Order Summary */}
        <OrderSummarySection
          items={orderSummary.items}
          itemCount={orderSummary.itemCount}
          subtotal={orderSummary.subtotal}
          expanded={summaryExpanded}
          onToggle={() => setSummaryExpanded(!summaryExpanded)}
        />

        {/* Add a Tip */}
        {restaurant.tippingEnabled && (
          <TipSection
            subtotal={orderSummary.subtotal}
            tipOption={tipOption}
            customTip={customTip}
            onTipOptionChange={setTipOption}
            onCustomTipChange={setCustomTip}
          />
        )}

        {/* Payment Method */}
        <PaymentMethodSection
          orderType={orderType}
          selectedMethod={paymentMethod}
          onMethodChange={setPaymentMethod}
        />

        {/* Totals */}
        <TotalsSection
          subtotal={orderSummary.subtotal}
          tax={orderSummary.tax}
          tip={tipAmount}
          total={total}
        />
      </div>

      {/* Place Order Button */}
      <PlaceOrderButton
        total={total}
        isEnabled={isFormComplete}
        onClick={() => {
          router.push("/order-confirmation");
        }}
      />
    </div>
  );
}
