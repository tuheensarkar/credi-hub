
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Calendar, Award } from "lucide-react";
import { LinkedInProfile } from "@/services/linkedinService";

interface LinkedInSectionProps {
  data: LinkedInProfile;
}

export const LinkedInSection = ({ data }: LinkedInSectionProps) => {
  return (
    <Card className="p-6 bg-gradient-card shadow-professional-md">
      <div className="flex items-center gap-3 mb-6">
        <Building className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Professional Background</h2>
      </div>

      {data.experience.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Experience</h3>
          <div className="space-y-4">
            {data.experience.slice(0, 3).map((exp, index) => (
              <div key={index} className="border-l-2 border-primary/20 pl-4">
                <h4 className="font-semibold">{exp.title}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Building className="h-3 w-3" />
                  <span>{exp.company}</span>
                  {exp.location && (
                    <>
                      <MapPin className="h-3 w-3 ml-2" />
                      <span>{exp.location}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-3 w-3" />
                  <span>{exp.duration}</span>
                </div>
                {exp.description && (
                  <p className="text-sm text-muted-foreground">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.education.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Education</h3>
          <div className="space-y-3">
            {data.education.slice(0, 2).map((edu, index) => (
              <div key={index} className="border-l-2 border-accent/20 pl-4">
                <h4 className="font-semibold">{edu.degree}</h4>
                <div className="text-sm text-muted-foreground">
                  {edu.school} • {edu.field}
                </div>
                <div className="text-sm text-muted-foreground">{edu.duration}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.certifications.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Certifications</h3>
          <div className="space-y-2">
            {data.certifications.slice(0, 4).map((cert, index) => (
              <div key={index} className="flex items-start gap-2">
                <Award className="h-4 w-4 text-warning mt-0.5" />
                <div>
                  <div className="font-medium text-sm">{cert.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {cert.issuer} • {cert.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.skills.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Professional Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.slice(0, 12).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
