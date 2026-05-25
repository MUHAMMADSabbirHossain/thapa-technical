import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import db from "@/config/db";
import { employers, jobs } from "@/drizzle/schema";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { formatDistanceToNow } from "date-fns";
import { desc, eq } from "drizzle-orm";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Link,
  MapPin,
  Search,
} from "lucide-react";
import Image from "next/image";

async function getFeatureJobs() {
  return await db
    .select({ job: jobs, employer: employers })
    .from(jobs)
    .leftJoin(employers, eq(jobs?.employerId, employers?.id))
    .orderBy(desc(jobs?.createdAt))
    .limit(6);
}

export default async function Home() {
  // const user = await getCurrentUser();
  // console.log(`user`, user);

  const featuredJobs = await getFeatureJobs();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="bg-gray-50 py-20 lg:py-32">
          <div className="container mx-auto max-w-7xl px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              Find a job that suits <br className="hidden md:block" />
              your interest & skills🔥
            </h1>
            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
              Discover thousands of job opportunities with top companies. Your
              next career move starts right here.
            </p>

            <form
              action="/jobs"
              method="GET"
              className="max-w-3xl mx-auto bg-white p-2 rounded-full shadow-lg flex flex-col sm:flex-row items-center gap-2 border"
            >
              <div className="flex-1 flex items-center pl-4 w-full">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  name="search" // ?search="full"
                  type="text"
                  placeholder="Job title, keyword..."
                  className="border-0 focus-visible:ring-0 shadow-none text-base"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto rounded-full px-8"
              >
                Search Jobs
              </Button>
            </form>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Featured Jobs
                </h2>
                <p className="text-gray-500 mt-2">
                  Know your worth and find the job that qualify your life
                </p>
              </div>
              <Button
                variant="outline"
                className="hidden sm:flex gap-2"
                asChild
              >
                <Link href="/jobs">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredJobs.map(({ job, employer }) => (
                <Card
                  key={job.id}
                  className="hover:shadow-md transition-shadow group"
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-gray-50 border flex items-center justify-center overflow-hidden relative shrink-0">
                        {employer?.bannerImageUrl ? (
                          <Image
                            src={employer.bannerImageUrl}
                            alt="Logo"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Building2 className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Badge variant="secondary" className="font-normal">
                            {job.jobType}
                          </Badge>
                          <span>•</span>
                          <span>
                            {formatDistanceToNow(new Date(job.createdAt))} ago
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-6">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />{" "}
                        {job.location || "Remote"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />{" "}
                        {employer?.name || "Company"}
                      </div>
                    </div>

                    <Button
                      className="w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                      asChild
                    >
                      <Link href={`/jobs/${job.id}`}>Apply Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto max-w-7xl px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl text-white">
            <Briefcase className="w-6 h-6" /> thapajob
          </div>
          <p className="text-sm">© {new Date().getFullYear()} thapajob.</p>
        </div>
      </footer>
    </div>
  );
}
