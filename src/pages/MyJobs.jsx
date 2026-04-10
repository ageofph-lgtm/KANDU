import React, { useState, useEffect, useCallback } from "react";
import { Job } from "@/entities/Job";
import { User } from "@/entities/User";
import { Application } from "@/entities/Application";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Check, Clock, User as UserIcon, AlertCircle, CheckCircle, Settings, Plus, Eye, MapPin, Euro, Users, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

// ── Status helpers ──────────────────────────────────────────────────────────
function statusBadge(status) {
  switch (status) {
    case 'open':         return <Badge className="bg-green-100 text-green-800 border-green-200">🟢 Aberta</Badge>;
    case 'in_progress':  return <Badge className="bg-blue-100 text-blue-800 border-blue-200">🔵 Em Curso</Badge>;
    case 'completed':    return <Badge className="bg-gray-100 text-gray-700 border-gray-200">✅ Concluída</Badge>;
    case 'completed_by_employer': return <Badge className="bg-orange-100 text-orange-800 border-orange-200">⏳ A aguardar avaliação</Badge>;
    default:             return <Badge variant="secondary">{status}</Badge>;
  }
}

// ── Employer Job Card ───────────────────────────────────────────────────────
function EmployerJobCard({ job, applications, onNavigate }) {
  const jobApps = applications.filter(a => a.job_id === job.id);
  const pendingApps = jobApps.filter(a => a.status === 'pending');
  const acceptedApp = jobApps.find(a => a.status === 'accepted');

  return (
    <Card className="mb-3 overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 pr-2">
            <h3 className="font-bold text-gray-900 text-sm leading-tight">{job.title}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <MapPin className="w-3 h-3" /> {job.location}
            </div>
          </div>
          {statusBadge(job.status)}
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span className="font-bold text-[#F26522] text-lg">€{job.price}</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {format(new Date(job.created_date), "dd MMM", { locale: pt })}
          </span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Eye className="w-3 h-3" /> {job.views || 0} vistas
          </span>
        </div>

        {/* Candidaturas summary */}
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {jobApps.length} candidatura(s)
              </span>
              {pendingApps.length > 0 && (
                <Badge className="bg-orange-500 text-white text-xs py-0.5 px-2">
                  {pendingApps.length} nova(s)
                </Badge>
              )}
            </div>
            {acceptedApp && (
              <div className="flex items-center gap-1 text-xs text-green-700 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                Profissional aceite
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={() => onNavigate("Applications")}
          >
            <Users className="w-3.5 h-3.5 mr-1" />
            Ver candidatos
          </Button>
          {job.status === 'open' && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs text-red-500 border-red-200 hover:bg-red-50"
              onClick={() => onNavigate("Dashboard")}
            >
              Editar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Worker Job Card ─────────────────────────────────────────────────────────
function WorkerJobCard({ job, application }) {
  const [employer, setEmployer] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      if (job.employer_id) {
        const users = await User.filter({ id: job.employer_id });
        if (users.length > 0) setEmployer(users[0]);
      }
    };
    fetch();
  }, [job]);

  function appStatusBadge(status) {
    switch (status) {
      case 'pending':  return <Badge className="bg-yellow-100 text-yellow-800">⏳ Pendente</Badge>;
      case 'accepted': return <Badge className="bg-green-100 text-green-800">✅ Aceite</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-700">❌ Recusada</Badge>;
      default:         return <Badge variant="secondary">{status}</Badge>;
    }
  }

  return (
    <Card className="mb-3 border border-gray-200 shadow-sm">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-2">
            <h3 className="font-bold text-gray-900 text-sm">{job.title}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <MapPin className="w-3 h-3" /> {job.location}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {statusBadge(job.status)}
            {application && appStatusBadge(application.status)}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-[#F26522] text-lg">€{job.price}</span>
          <span className="text-xs text-gray-400">
            {format(new Date(job.created_date), "dd MMM yyyy", { locale: pt })}
          </span>
        </div>

        {employer && (
          <div className="flex items-center gap-2 pt-2 border-t text-sm text-gray-500">
            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs flex-shrink-0">
              {employer.full_name?.charAt(0) || "?"}
            </div>
            <span>{employer.full_name || "Empregador"}</span>
          </div>
        )}

        {application?.message && (
          <div className="bg-gray-50 rounded-lg p-2.5 text-xs text-gray-600 italic">
            "{application.message.slice(0, 100)}{application.message.length > 100 ? '...' : ''}"
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function MyJobs() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      if (currentUser.user_type === 'worker') {
        // Worker: get their applications, then the corresponding jobs
        const myApps = await Application.filter({ worker_id: currentUser.id }, "-created_date");
        setApplications(myApps);

        if (myApps.length > 0) {
          const jobIds = [...new Set(myApps.map(a => a.job_id))];
          // fetch jobs — filter by id list
          const allJobs = await Job.list("-created_date");
          const myJobs = allJobs.filter(j => jobIds.includes(j.id));
          setJobs(myJobs);
        } else {
          setJobs([]);
        }
      } else {
        // Employer: get jobs they published
        const myJobs = await Job.filter({ employer_id: currentUser.id }, "-created_date");
        setJobs(myJobs);

        if (myJobs.length > 0) {
          const jobIds = myJobs.map(j => j.id);
          const allApps = await Application.list("-created_date");
          const relevantApps = allApps.filter(a => jobIds.includes(a.job_id));
          setApplications(relevantApps);
        } else {
          setApplications([]);
        }
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) {
    return (
      <div className="p-4 h-screen flex flex-col items-center justify-center">
        <Settings className="w-12 h-12 text-[#F26522] animate-spin mb-4" />
        <p className="text-gray-500">A carregar...</p>
      </div>
    );
  }

  // ── EMPLOYER VIEW ──────────────────────────────────────────────────────────
  if (user?.user_type === 'employer' || user?.user_type === 'admin') {
    const openJobs = jobs.filter(j => j.status === 'open');
    const activeJobs = jobs.filter(j => j.status === 'in_progress');
    const doneJobs = jobs.filter(j => j.status === 'completed' || j.status === 'completed_by_employer');
    const totalPendingApps = applications.filter(a => a.status === 'pending').length;

    return (
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="px-4 py-5 border-b border-gray-100 bg-white sticky top-0 z-10 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Minhas Obras</h1>
            <p className="text-xs text-gray-500">{jobs.length} publicadas</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={loadData}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              className="bg-[#F26522] hover:bg-orange-600 text-white"
              onClick={() => navigate(createPageUrl("NewJob"))}
            >
              <Plus className="w-4 h-4 mr-1" /> Nova Obra
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-2 px-4 py-3 bg-orange-50 border-b border-orange-100">
          {[
            { label: "Abertas",    value: openJobs.length,   color: "text-green-700" },
            { label: "Em Curso",   value: activeJobs.length, color: "text-blue-700" },
            { label: "Concluídas", value: doneJobs.length,   color: "text-gray-600" },
            { label: "Pendentes",  value: totalPendingApps,  color: "text-orange-700" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="p-4">
          {jobs.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="mx-auto w-14 h-14 text-gray-300 mb-4" />
              <h3 className="font-semibold text-gray-700 mb-2">Ainda não publicaste obras</h3>
              <p className="text-sm text-gray-400 mb-6">Cria a tua primeira obra e começa a receber candidatos.</p>
              <Button
                onClick={() => navigate(createPageUrl("NewJob"))}
                className="bg-[#F26522] hover:bg-orange-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" /> Criar primeira obra
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="open">
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="open">
                  Abertas <span className="ml-1 text-xs bg-green-100 text-green-700 rounded-full px-1.5 py-0.5">{openJobs.length}</span>
                </TabsTrigger>
                <TabsTrigger value="active">
                  Em Curso <span className="ml-1 text-xs bg-blue-100 text-blue-700 rounded-full px-1.5 py-0.5">{activeJobs.length}</span>
                </TabsTrigger>
                <TabsTrigger value="done">
                  Concluídas <span className="ml-1 text-xs bg-gray-100 text-gray-600 rounded-full px-1.5 py-0.5">{doneJobs.length}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="open">
                {openJobs.length === 0 ? (
                  <EmptyState icon={<Briefcase />} msg="Sem obras abertas" />
                ) : openJobs.map(job => (
                  <EmployerJobCard key={job.id} job={job} applications={applications} onNavigate={(p) => navigate(createPageUrl(p))} />
                ))}
              </TabsContent>

              <TabsContent value="active">
                {activeJobs.length === 0 ? (
                  <EmptyState icon={<Clock />} msg="Sem obras em curso" />
                ) : activeJobs.map(job => (
                  <EmployerJobCard key={job.id} job={job} applications={applications} onNavigate={(p) => navigate(createPageUrl(p))} />
                ))}
              </TabsContent>

              <TabsContent value="done">
                {doneJobs.length === 0 ? (
                  <EmptyState icon={<Check />} msg="Sem obras concluídas" />
                ) : doneJobs.map(job => (
                  <EmployerJobCard key={job.id} job={job} applications={applications} onNavigate={(p) => navigate(createPageUrl(p))} />
                ))}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    );
  }

  // ── WORKER VIEW ───────────────────────────────────────────────────────────
  const pendingApps = applications.filter(a => a.status === 'pending');
  const acceptedApps = applications.filter(a => a.status === 'accepted');
  const rejectedApps = applications.filter(a => a.status === 'rejected');

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-4 py-5 border-b border-gray-100 bg-white sticky top-0 z-10 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Meus Trabalhos</h1>
          <p className="text-xs text-gray-500">{applications.length} candidatura(s)</p>
        </div>
        <Button size="sm" variant="outline" onClick={loadData}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4">
        {applications.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="mx-auto w-14 h-14 text-gray-300 mb-4" />
            <h3 className="font-semibold text-gray-700 mb-2">Nenhuma candidatura ainda</h3>
            <p className="text-sm text-gray-400 mb-6">Começa por pesquisar obras perto de ti.</p>
            <Button
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="bg-[#F26522] hover:bg-orange-600 text-white"
            >
              Ver obras disponíveis
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="pending">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="pending">
                Pendentes <span className="ml-1 text-xs bg-yellow-100 text-yellow-700 rounded-full px-1.5 py-0.5">{pendingApps.length}</span>
              </TabsTrigger>
              <TabsTrigger value="accepted">
                Aceites <span className="ml-1 text-xs bg-green-100 text-green-700 rounded-full px-1.5 py-0.5">{acceptedApps.length}</span>
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Recusadas <span className="ml-1 text-xs bg-red-100 text-red-600 rounded-full px-1.5 py-0.5">{rejectedApps.length}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {pendingApps.length === 0 ? (
                <EmptyState icon={<Clock />} msg="Nenhuma candidatura pendente" />
              ) : pendingApps.map(app => {
                const job = jobs.find(j => j.id === app.job_id);
                return job ? <WorkerJobCard key={app.id} job={job} application={app} /> : null;
              })}
            </TabsContent>

            <TabsContent value="accepted">
              {acceptedApps.length === 0 ? (
                <EmptyState icon={<CheckCircle />} msg="Nenhuma candidatura aceite ainda" />
              ) : acceptedApps.map(app => {
                const job = jobs.find(j => j.id === app.job_id);
                return job ? <WorkerJobCard key={app.id} job={job} application={app} /> : null;
              })}
            </TabsContent>

            <TabsContent value="rejected">
              {rejectedApps.length === 0 ? (
                <EmptyState icon={<AlertCircle />} msg="Sem candidaturas recusadas" />
              ) : rejectedApps.map(app => {
                const job = jobs.find(j => j.id === app.job_id);
                return job ? <WorkerJobCard key={app.id} job={job} application={app} /> : null;
              })}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, msg }) {
  return (
    <div className="text-center py-12">
      <div className="w-12 h-12 text-gray-300 mx-auto mb-3">{icon}</div>
      <p className="text-gray-500 text-sm">{msg}</p>
    </div>
  );
}
