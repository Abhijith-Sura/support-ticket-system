import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, History, MessageSquare, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AppLayout from '../components/Layout/AppLayout';
import AdminTicketDetail from '../components/Admin/AdminTicketDetail';
import ActivityTimeline from '../components/Tickets/ActivityTimeline';
import CommentList from '../components/Comments/CommentList';
import CommentForm from '../components/Comments/CommentForm';
import Modal from '../components/Common/Modal';
import Loading from '../components/Common/Loading';
import ErrorMessage from '../components/Common/ErrorMessage';
import { ticketService } from '../services/ticketService';
import { commentService } from '../services/commentService';
import { adminService } from '../services/adminService';
import { getErrorMessage } from '../utils/helpers';

const AdminTicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [activity, setActivity] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [updating, setUpdating] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [ticketData, commentsData, activityData, usersData] = await Promise.all([
        ticketService.getTicket(id),
        commentService.getComments(id),
        ticketService.getTicketActivity(id),
        adminService.getUsers(),
      ]);
      setTicket(ticketData);
      setComments(commentsData || []);
      setActivity(activityData || []);
      setAdmins((usersData || []).filter((u) => u.role === 'admin'));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load ticket'));
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
      adminService.getUsers(),
    ])
      .then(([ticketData, commentsData, activityData, usersData]) => {
        if (!active) return;
        setTicket(ticketData);
        setComments(commentsData || []);
        setActivity(activityData || []);
        setAdmins((usersData || []).filter((u) => u.role === 'admin'));
        setError('');
      })
      .catch((err) => {
        if (!active) return;
        setError(getErrorMessage(err, 'Failed to load ticket'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleUpdate = async (payload) => {
    setUpdating(true);
    try {
      const updated = await adminService.updateTicket(id, payload);
      setTicket(updated);
      toast.success('Ticket updated');
      const freshActivity = await ticketService.getTicketActivity(id);
      setActivity(freshActivity || []);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update ticket'));
    } finally {
      setUpdating(false);
    }
  };

  const handleAddComment = async (text) => {
    setPostingComment(true);
    try {
      const created = await commentService.addComment(id, text);
      setComments((prev) => [...prev, created]);
      toast.success('Reply posted');
      const freshActivity = await ticketService.getTicketActivity(id);
      setActivity(freshActivity || []);
      return true;
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to post reply'));
      return false;
    } finally {
      setPostingComment(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await ticketService.deleteTicket(id);
      toast.success('Ticket deleted');
      navigate('/admin/tickets', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to delete ticket'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/admin/tickets"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Tickets
          </Link>

          {ticket && (
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Ticket
            </button>
          )}
        </div>

        {loading ? (
          <Loading text="Loading ticket details..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadData} />
        ) : ticket ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <AdminTicketDetail
                key={`${ticket._id}-${ticket.updatedAt}`}
                ticket={ticket}
                admins={admins}
                onUpdate={handleUpdate}
                updating={updating}
              />

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-slate-900">
                    Ticket Conversation ({comments.length})
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
                  <h2 className="text-base font-semibold text-slate-900">Ticket Activity Log</h2>
                </div>
                <ActivityTimeline activities={activity} />
              </div>
            </div>
          </div>
        ) : null}

        <Modal
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          title="Delete Ticket"
          confirmLabel="Delete Ticket"
          onConfirm={handleDelete}
          danger
          loading={deleting}
        >
          Are you sure you want to permanently delete <strong>{ticket?.title}</strong>?
        </Modal>
      </div>
    </AppLayout>
  );
};

export default AdminTicketDetailPage;
