import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, History, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import AppLayout from '../components/Layout/AppLayout';
import TicketDetail from '../components/Tickets/TicketDetail';
import TicketForm from '../components/Tickets/TicketForm';
import ActivityTimeline from '../components/Tickets/ActivityTimeline';
import CommentList from '../components/Comments/CommentList';
import CommentForm from '../components/Comments/CommentForm';
import Modal from '../components/Common/Modal';
import Loading from '../components/Common/Loading';
import ErrorMessage from '../components/Common/ErrorMessage';
import { ticketService } from '../services/ticketService';
import { commentService } from '../services/commentService';
import { getErrorMessage } from '../utils/helpers';

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [postingComment, setPostingComment] = useState(false);

  const loadTicketData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [ticketData, commentsData, activityData] = await Promise.all([
        ticketService.getTicket(id),
        commentService.getComments(id),
        ticketService.getTicketActivity(id),
      ]);
      setTicket(ticketData);
      setComments(commentsData || []);
      setActivity(activityData || []);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load ticket details'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let active = true;
    Promise.all([
      ticketService.getTicket(id),
      commentService.getComments(id),
      ticketService.getTicketActivity(id),
    ])
      .then(([ticketData, commentsData, activityData]) => {
        if (!active) return;
        setTicket(ticketData);
        setComments(commentsData || []);
        setActivity(activityData || []);
        setError('');
      })
      .catch((err) => {
        if (!active) return;
        setError(getErrorMessage(err, 'Failed to load ticket details'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleUpdate = async (payload) => {
    setSaving(true);
    try {
      const updated = await ticketService.updateTicket(id, payload);
      setTicket(updated);
      setEditing(false);
      toast.success('Ticket updated successfully');
      const freshActivity = await ticketService.getTicketActivity(id);
      setActivity(freshActivity || []);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update ticket'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await ticketService.deleteTicket(id);
      toast.success('Ticket deleted');
      navigate('/tickets', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to delete ticket'));
    } finally {
      setDeleting(false);
    }
  };

  const handleAddComment = async (text) => {
    setPostingComment(true);
    try {
      const created = await commentService.addComment(id, text);
      setComments((prev) => [...prev, created]);
      toast.success('Comment posted');
      const freshActivity = await ticketService.getTicketActivity(id);
      setActivity(freshActivity || []);
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to post comment'));
      return false;
    } finally {
      setPostingComment(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <Link
          to="/tickets"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Tickets
        </Link>

        {loading ? (
          <Loading text="Loading ticket details..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadTicketData} />
        ) : ticket ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {editing ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h2 className="text-lg font-semibold text-slate-900">Edit Ticket</h2>
                  <TicketForm
                    initialValues={ticket}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditing(false)}
                    submitLabel="Save Changes"
                    submitting={saving}
                  />
                </div>
              ) : (
                <TicketDetail
                  ticket={ticket}
                  onEdit={() => setEditing(true)}
                  onDelete={() => setDeleteOpen(true)}
                />
              )}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-slate-900">
                    Discussion ({comments.length})
                  </h2>
                </div>
                <CommentList comments={comments} />
                <div className="pt-4 border-t border-slate-100">
                  <CommentForm onSubmit={handleAddComment} submitting={postingComment} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <History className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-base font-semibold text-slate-900">Activity Log</h2>
                </div>
                <ActivityTimeline activities={activity} />
              </div>
            </div>
          </div>
        ) : null}

        <Modal
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          title="Delete Support Ticket"
          confirmLabel="Delete Ticket"
          onConfirm={handleDelete}
          danger
          loading={deleting}
        >
          Are you sure you want to delete <strong>{ticket?.title}</strong>? This action cannot be
          undone and will remove all associated comments.
        </Modal>
      </div>
    </AppLayout>
  );
};

export default TicketDetailPage;
