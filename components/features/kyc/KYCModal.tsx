"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  currentStatus?: string;
}

export function KYCModal({ isOpen, onClose, onSuccess, currentStatus = "PENDING" }: KYCModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    aadhaar_number: "",
    pan_number: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    aadhaar_file: null as File | null,
    pan_file: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'aadhaar' | 'pan') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size should be less than 5MB");
        return;
      }
      if (type === 'aadhaar') {
        setFormData(prev => ({ ...prev, aadhaar_file: file }));
      } else {
        setFormData(prev => ({ ...prev, pan_file: file }));
      }
    }
  };

  const validateAadhaar = (aadhaar: string) => {
    return /^\d{12}$/.test(aadhaar);
  };

  const validatePAN = (pan: string) => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
  };

  const validatePincode = (pincode: string) => {
    return /^\d{6}$/.test(pincode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!validateAadhaar(formData.aadhaar_number)) {
      setError("Aadhaar number must be 12 digits");
      setLoading(false);
      return;
    }

    if (!validatePAN(formData.pan_number)) {
      setError("PAN number must be in format: ABCDE1234F");
      setLoading(false);
      return;
    }

    if (!validatePincode(formData.pincode)) {
      setError("Pincode must be 6 digits");
      setLoading(false);
      return;
    }

    if (!formData.address || !formData.city || !formData.state) {
      setError("Please fill all address fields");
      setLoading(false);
      return;
    }

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("aadhaar_number", formData.aadhaar_number);
      submitData.append("pan_number", formData.pan_number);
      submitData.append("address", formData.address);
      submitData.append("city", formData.city);
      submitData.append("state", formData.state);
      submitData.append("pincode", formData.pincode);
      
      if (formData.aadhaar_file) {
        submitData.append("aadhaar_file", formData.aadhaar_file);
      }
      if (formData.pan_file) {
        submitData.append("pan_file", formData.pan_file);
      }

      const response = await fetch("/api/user/kyc", {
        method: "POST",
        body: submitData,
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess?.();
          onClose();
          // Reset form
          setFormData({
            aadhaar_number: "",
            pan_number: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            aadhaar_file: null,
            pan_file: null,
          });
          setStep(1);
          setSuccess(false);
        }, 2000);
      } else {
        setError(result.error?.message || "Failed to submit KYC. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-forest to-forest-light p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-heading font-bold text-white">Complete KYC Verification</h2>
              <p className="text-white/80 text-sm mt-1">Verify your identity to unlock all features</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-charcoal mb-2">KYC Submitted Successfully!</h3>
                <p className="text-gray-600">
                  Your KYC documents have been submitted. We'll verify them within 24-48 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Aadhaar */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
                        <FileText className="h-4 w-4 text-forest" />
                        Aadhaar Number
                      </label>
                      <Input
                        type="text"
                        name="aadhaar_number"
                        placeholder="Enter 12-digit Aadhaar number"
                        value={formData.aadhaar_number}
                        onChange={handleInputChange}
                        maxLength={12}
                        required
                        disabled={loading}
                        className="h-12 rounded-xl"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter your 12-digit Aadhaar number
                      </p>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
                        <Upload className="h-4 w-4 text-forest" />
                        Aadhaar Card (Front)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-forest/50 transition-colors">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(e, 'aadhaar')}
                          className="hidden"
                          id="aadhaar-upload"
                          disabled={loading}
                        />
                        <label
                          htmlFor="aadhaar-upload"
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          <Upload className="h-8 w-8 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formData.aadhaar_file ? formData.aadhaar_file.name : "Click to upload Aadhaar card"}
                          </span>
                          <span className="text-xs text-gray-400">Max 5MB (JPG, PNG, PDF)</span>
                        </label>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      variant="primary"
                      className="w-full h-12 rounded-xl"
                      disabled={!formData.aadhaar_number}
                    >
                      Next: PAN Details
                    </Button>
                  </motion.div>
                )}

                {/* Step 2: PAN */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
                        <FileText className="h-4 w-4 text-forest" />
                        PAN Number
                      </label>
                      <Input
                        type="text"
                        name="pan_number"
                        placeholder="ABCDE1234F"
                        value={formData.pan_number}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase();
                          setFormData(prev => ({ ...prev, pan_number: value }));
                        }}
                        maxLength={10}
                        required
                        disabled={loading}
                        className="h-12 rounded-xl"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter your 10-character PAN number
                      </p>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
                        <Upload className="h-4 w-4 text-forest" />
                        PAN Card
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-forest/50 transition-colors">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(e, 'pan')}
                          className="hidden"
                          id="pan-upload"
                          disabled={loading}
                        />
                        <label
                          htmlFor="pan-upload"
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          <Upload className="h-8 w-8 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formData.pan_file ? formData.pan_file.name : "Click to upload PAN card"}
                          </span>
                          <span className="text-xs text-gray-400">Max 5MB (JPG, PNG, PDF)</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        onClick={() => setStep(1)}
                        variant="outline"
                        className="flex-1 h-12 rounded-xl"
                        disabled={loading}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setStep(3)}
                        variant="primary"
                        className="flex-1 h-12 rounded-xl"
                        disabled={!formData.pan_number}
                      >
                        Next: Address
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Address */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
                        <FileText className="h-4 w-4 text-forest" />
                        Address
                      </label>
                      <Input
                        type="text"
                        name="address"
                        placeholder="House/Flat number, Street"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        className="h-12 rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
                          City
                        </label>
                        <Input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
                          State
                        </label>
                        <Input
                          type="text"
                          name="state"
                          placeholder="State"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                          className="h-12 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
                        Pincode
                      </label>
                      <Input
                        type="text"
                        name="pincode"
                        placeholder="6-digit pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        maxLength={6}
                        required
                        disabled={loading}
                        className="h-12 rounded-xl"
                      />
                    </div>

                    <AnimatePresence mode="wait">
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2"
                        >
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        onClick={() => setStep(2)}
                        variant="outline"
                        className="flex-1 h-12 rounded-xl"
                        disabled={loading}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        className="flex-1 h-12 rounded-xl"
                        isLoading={loading}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Submit KYC
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
