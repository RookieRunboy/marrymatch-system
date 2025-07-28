package com.marrymatch.plugin.toolwindow;

import com.intellij.openapi.project.Project;
import com.intellij.ui.components.JBLabel;
import com.intellij.ui.components.JBPanel;
import com.intellij.ui.components.JBScrollPane;
import com.intellij.ui.components.JBTabbedPane;
import com.marrymatch.plugin.ui.PersonalEvaluationPanel;
import com.marrymatch.plugin.ui.MatchAnalysisPanel;
import com.marrymatch.plugin.ui.HistoryPanel;

import javax.swing.*;
import java.awt.*;

/**
 * MARRYMATCH主工具窗口
 */
public class MarryMatchToolWindow {
    private final Project project;
    private JPanel mainPanel;

    public MarryMatchToolWindow(Project project) {
        this.project = project;
        initializeUI();
    }

    private void initializeUI() {
        mainPanel = new JBPanel<>(new BorderLayout());
        
        // 创建标题
        JBLabel titleLabel = new JBLabel("MARRYMATCH - 择偶评分系统");
        titleLabel.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 16));
        titleLabel.setHorizontalAlignment(SwingConstants.CENTER);
        titleLabel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        
        // 创建选项卡面板
        JBTabbedPane tabbedPane = new JBTabbedPane();
        
        // 个人评估选项卡
        PersonalEvaluationPanel personalPanel = new PersonalEvaluationPanel(project);
        tabbedPane.addTab("个人评估", personalPanel);
        
        // 匹配分析选项卡
        MatchAnalysisPanel matchPanel = new MatchAnalysisPanel(project);
        tabbedPane.addTab("匹配分析", matchPanel);
        
        // 历史记录选项卡
        HistoryPanel historyPanel = new HistoryPanel(project);
        tabbedPane.addTab("历史记录", historyPanel);
        
        // 添加组件到主面板
        mainPanel.add(titleLabel, BorderLayout.NORTH);
        mainPanel.add(tabbedPane, BorderLayout.CENTER);
        
        // 添加底部信息
        JBLabel infoLabel = new JBLabel("💡 理性择偶，科学评分");
        infoLabel.setHorizontalAlignment(SwingConstants.CENTER);
        infoLabel.setBorder(BorderFactory.createEmptyBorder(5, 10, 10, 10));
        mainPanel.add(infoLabel, BorderLayout.SOUTH);
    }

    public JComponent getContent() {
        return mainPanel;
    }
}