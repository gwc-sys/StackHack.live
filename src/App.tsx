import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./pages/AuthContext";
import AppProvider from "./DSAChallenges/DSAchallenges";
import Layout from "./components/Layout.tsx";
import Home from "./pages/Home";
import About from "./pages/About";
import Universities from "./pages/Universities.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import QuickDSA from "./DSAChallenges/DSAchallenges.tsx";
import Header from "./components/Header";
import Resources from "./pages/Resources";
import DevCourses from "./pages/Roadmaps";
import EventsHackathons from "./pages/EventsHackathons";
import FrontendRoadmapsPage from "./RoadmapsPages/frontendRoadmapsPage.tsx";
import Collaboration from "./pages/Collaboration";
import UserProfile from "./pages/UserProfile";
import Problems from "./DSAChallenges/ProblemDetailPage.tsx";    
import NotFound from "./pages/NotFound.tsx";
import AILearningRoadmap from "./pages/AILearningRoadmap.tsx";   
import AIMentor from "./pages/AIMentor.tsx"; 
import ProblemDetailPage from "./DSAChallenges/ProblemDetailPage";
import OnlineIDE from "./pages/OnlineIDE.tsx";
import JavaPracticals from "./pages/DigitalCommunication.tsx"; // <-- new import
import DigitalCommunication from "./pages/DigitalCommunication";
import JavaScriptExperiments from "./pages/JavaScriptExperiments";
import VLSIDesignComplete from "./pages/VLSIDesignComplete";

function MainApp() {
  return (
    <AuthProvider> 
      <Header />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/java-practical" element={<JavaPracticals />} />  {/* new route */}
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/QuickDSA" element={<QuickDSA />} />
          <Route path="/universities" element={<Universities />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/DevCourses" element={<DevCourses />} />
          <Route path="/events-hackathons" element={<EventsHackathons />} />
          <Route path="/roadmaps/role/frontend" element={<FrontendRoadmapsPage />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/dsa-challenges" element={<AppProvider />} />
          <Route path="/problems/:id" element={<ProblemDetailPage />} />
          <Route path="*" element={<NotFound />} /> 
          <Route path="/ai-learning-roadmap" element={<AILearningRoadmap />} />
          <Route path="/ai-mentor" element={<AIMentor />} />
          <Route path="/dsa-challenges/problems/:id" element={<Problems />} />
          <Route path="/online-ide" element={<OnlineIDE/>} />
          <Route path="/digital-communication" element={<DigitalCommunication />} />
          <Route path="/javascript-experiments" element={<JavaScriptExperiments />} />
          <Route path="/vlsi-design" element={<VLSIDesignComplete />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default MainApp;
