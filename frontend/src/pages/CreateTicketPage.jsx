import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import AppLayout from '../components/Layout/AppLayout';
import TicketForm from '../components/Tickets/TicketForm';
import { ticketService } from '../services/ticketService';
import { getErrorMessage } from '../utils/helpers';

const CreateTicketPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      const created = await ticketService.createTicket(payload);
      toast.success('Support ticket submitted!');
      navigate(`/tickets/${created._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to create ticket'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Link
            to="/tickets"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Tickets
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Create Support Ticket</h1>
          <p className="text-sm text-slate-500 mt-1">
            Provide clear details so our support team can resolve your issue quickly.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <TicketForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/tickets')}
            submitLabel="Submit Ticket"
            submitting={submitting}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateTicketPage;
