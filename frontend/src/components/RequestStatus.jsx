import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

const RequestStatus = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/api/requests');
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle2 size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="pt-28 pb-10 px-6 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">My Sell Requests</h1>
        <p className="text-slate-400">Track the status of your crop sale requests.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-[2rem]">
          <Clock className="mx-auto text-slate-600 mb-4" size={48} />
          <h3 className="text-xl font-medium text-slate-300">No requests yet</h3>
          <p className="text-slate-500 mt-2">Go to the marketplace to find buyers for your crops.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={req._id}
              className="glass-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl">
                  {req.crop === 'tomato' ? '🍅' : req.crop === 'soybean' ? '🌱' : req.crop === 'onion' ? '🧅' : '🌾'}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg capitalize">{req.crop} Offer</h3>
                  <p className="text-slate-500 text-sm">To: <span className="text-slate-300">{req.companyId?.name || 'Unknown Company'}</span></p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
                <div>
                  <span className="text-slate-500 block mb-1">Quantity</span>
                  <span className="text-white font-medium">{req.quantity} Qntl</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Price</span>
                  <span className="text-emerald-400 font-bold">₹{req.expectedPrice}/Q</span>
                </div>
                <div className="hidden md:block">
                  <span className="text-slate-500 block mb-1">Date</span>
                  <span className="text-slate-300">{new Date(req.submissionDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${getStatusStyle(req.status)}`}>
                  {getStatusIcon(req.status)}
                  {req.status}
                </div>
                <ChevronRight className="text-slate-700 hidden md:block" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestStatus;
