import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import JobTypesPage from '@/components/admin/master-data/JobTypesPage';
import SubjectsPage from '@/components/admin/master-data/SubjectsPage';
import LocationsPage from '@/components/admin/master-data/LocationsPage';
import AssessmentSkillsPage from '@/components/admin/master-data/AssessmentSkillsPage';

const MasterDataPage = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Master Data Management</h1>
            <Tabs defaultValue="job-types" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="job-types">Job Types</TabsTrigger>
                    <TabsTrigger value="subjects">Subjects</TabsTrigger>
                    <TabsTrigger value="locations">Locations</TabsTrigger>
                    <TabsTrigger value="assessment-skills">Assessment Skills</TabsTrigger>
                </TabsList>
                <TabsContent value="job-types" className="mt-4">
                    <JobTypesPage />
                </TabsContent>
                <TabsContent value="subjects" className="mt-4">
                    <SubjectsPage />
                </TabsContent>
                <TabsContent value="locations" className="mt-4">
                    <LocationsPage />
                </TabsContent>
                <TabsContent value="assessment-skills" className="mt-4">
                    <AssessmentSkillsPage />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MasterDataPage;